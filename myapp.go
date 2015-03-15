package hello

import (
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"github.com/gorilla/mux"

	"appengine"
	"appengine/datastore"
)

func init() {
	r := mux.NewRouter()
	r.HandleFunc("/paciente", getPatientsList).Methods("GET")
	r.HandleFunc("/paciente", createPatient).Methods("POST")
	r.HandleFunc("/paciente/{id}", getPatient).Methods("GET")
	r.HandleFunc("/paciente/{id}", updatePatient).Methods("POST")
	r.HandleFunc("/paciente/{id}", deletePatient).Methods("DELETE")
	r.HandleFunc("/consulta", createHistoriaConsulta).Methods("POST")
	http.Handle("/", r)
}

func getPatientsList(w http.ResponseWriter, r *http.Request) {

	c := appengine.NewContext(r)
	q := datastore.NewQuery("Paciente")

	/* Creo y lleno una lista de usuarios o pacientes */
	var patients []Usuario
	if _, err := q.GetAll(c, &patients); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	/* Convierto la lista de usuarios en un objeto de tipo json */
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(patients); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

}

func getPatient(w http.ResponseWriter, r *http.Request) {

	c := appengine.NewContext(r)
	vars := mux.Vars(r)
	id, _ := strconv.ParseInt(vars["id"], 10, 64)
	key := datastore.NewKey(c, "Paciente", "", id, nil)

	var u Usuario
	if err := datastore.Get(c, key, &u); err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	if j, err := json.Marshal(u); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	} else {
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		w.Write(j)
	}
}

func createPatient(w http.ResponseWriter, r *http.Request) {
	var u Usuario

	if err := json.NewDecoder(r.Body).Decode(&u); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	c := appengine.NewContext(r)
	key := datastore.NewKey(c, "Paciente", "", u.Identificacion, nil)

	var usr Usuario
	if err := datastore.Get(c, key, &usr); err == nil {
		http.Error(w, "Paciente ya existe", http.StatusBadRequest)
		return
	}

	_, err := datastore.Put(c, key, &u)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func updatePatient(w http.ResponseWriter, r *http.Request) {

	var u Usuario
	var usr Usuario
	if err := json.NewDecoder(r.Body).Decode(&u); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	c := appengine.NewContext(r)
	key := datastore.NewKey(c, "Paciente", "", u.Identificacion, nil)

	/* Compruebo que el paciente si exista, se supone que esta función actualiza pero
	no crea nuevos pacientes, normalmente sin la comprobación, se crearía un nuevo paciente */
	if err := datastore.Get(c, key, &usr); err != nil {
		http.Error(w, "Intento de actualizar un paciente que no existe", http.StatusBadRequest)
		return
	}

	if _, err := datastore.Put(c, key, &u); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(u)

}

func deletePatient(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.ParseInt(vars["id"], 10, 64)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
	c := appengine.NewContext(r)
	key := datastore.NewKey(c, "Paciente", "", id, nil)
	err = datastore.Delete(c, key)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

/* Aqui se define el modelo para la base de datos */
type Usuario struct {
	Nombres            string
	PrimerApellido     string
	SegundoApellido    string
	Genero             string
	FechaNacimiento    time.Time
	Identificacion     int64
	TipoIdentificacion string

	// Sociales

	Escolaridad  string
	Ocupacion    string
	EstadoCivil  string
	Direccion    string
	Barrio       string
	Municipio    string
	Departamento string
	Pais         string

	// Contacto

	Telefono string
	Email    string
}

type Antecedente struct {
	Usuario int64
	Tipo    string
	Detalle string
}
