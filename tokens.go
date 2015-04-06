package hello

import (
	"crypto/rand"
	"crypto/rsa"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/dgrijalva/jwt-go"
	"golang.org/x/crypto/bcrypt"

	"appengine"
	"appengine/datastore"
)

var secretKey, _ = rsa.GenerateKey(rand.Reader, 1024)

/* TODO: API endpoints for authentication system:
Handler middleware to protect some endpoints
*/
func login(w http.ResponseWriter, r *http.Request) {
	var rd map[string]string
	var u User
	if err := json.NewDecoder(r.Body).Decode(&rd); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	c := appengine.NewContext(r)

	k := datastore.NewKey(c, "User", rd["username"], 0, nil)

	if err := datastore.Get(c, k, &u); err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	if err := bcrypt.CompareHashAndPassword(
		[]byte(u.Password),
		[]byte(rd["password"]),
	); err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	tokenString, err := createToken(u.Username, u.AuthorizationLevel)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if err := json.NewEncoder(w).Encode(
		map[string]string{"authorization": tokenString}); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func logup(w http.ResponseWriter, r *http.Request) {
	var u User
	if err := json.NewDecoder(r.Body).Decode(&u); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	c := appengine.NewContext(r)
	k := datastore.NewKey(c, "User", u.Username, 0, nil)

	if err := datastore.Get(c, k, &u); err == nil {
		w.WriteHeader(http.StatusConflict)
		json.NewEncoder(w).Encode(
			map[string]string{"error": "Username already exist"})
		return
	}

	if p, err := bcrypt.GenerateFromPassword([]byte(u.Password), 15); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	} else {
		u.Password = string(p)
	}

	if _, err := datastore.Put(c, k, &u); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	tokenString, err := createToken(u.Username, u.AuthorizationLevel)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if err := json.NewEncoder(w).Encode(
		map[string]string{"authorization": tokenString}); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func protect(h http.Handler) http.Handler {
	f := func(w http.ResponseWriter, r *http.Request) {
		token := r.Header.Get("Authorization")
		if ok := validateToken(token[7:len(token)]); !ok {
			http.Error(w, "Unautho", http.StatusUnauthorized)
			return
		}
		fmt.Print(w, "Protected")
		h.ServeHTTP(w, r)
	}
	return http.HandlerFunc(f)
}

func validateToken(token string) bool {
	if _, err := jwt.Parse(token, func(t *jwt.Token) (interface{}, error) {
		return secretKey.Public(), nil
	}); err != nil {
		return false
	}
	return true
}

func createToken(username, authLevel string) (string, error) {
	token := jwt.New(jwt.SigningMethodRS256)
	token.Claims["username"] = username
	token.Claims["auth_level"] = authLevel

	return token.SignedString(secretKey)
}

type User struct {
	Username           string `json:"username"`
	Password           string `json:"password"`
	AuthorizationLevel string `json:"auth_level"`
}
