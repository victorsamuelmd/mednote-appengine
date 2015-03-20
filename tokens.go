package hello

import (
	"crypto/rand"
	"crypto/rsa"
	"encoding/json"
	"net/http"

	"github.com/dgrijalva/jwt-go"
)

var secretKey, _ = rsa.GenerateKey(rand.Reader, 1024)

func showKey(w http.ResponseWriter, r *http.Request) {
	token := jwt.New(jwt.SigningMethodRS256)
	token.Claims["username"] = "victorsamuelmd"

	tokenString, err := token.SignedString(secretKey)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if err := json.NewEncoder(w).Encode(map[string]string{"authorization": tokenString}); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func validateToken(w http.ResponseWriter, r *http.Request) {
	var rd map[string]string
	if err := json.NewDecoder(r.Body).Decode(&rd); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	token, err := jwt.Parse(rd["authorization"], func(t *jwt.Token) (interface{}, error) {
		return secretKey.Public(), nil
	})
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}
	json.NewEncoder(w).Encode(map[string]interface{}{"valid": token.Valid})
}
