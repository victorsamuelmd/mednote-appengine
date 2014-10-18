package hello

import (
	"encoding/json"
	"io/ioutil"
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
	r.HandleFunc("/paciente/{id}", nil).Methods("POST")
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
	if j, err := json.Marshal(patients); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	} else {
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		w.Write(j)
	}

}

func getPatient(w http.ResponseWriter, r *http.Request) {

	c := appengine.NewContext(r)
	vars := mux.Vars(r)
	id, _ := strconv.ParseInt(vars["id"], 10, 64)
	key := datastore.NewKey(c, "Paciente", "", id, nil)

	var u Usuario
	if err := datastore.Get(c, key, &u); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
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
	data, err := ioutil.ReadAll(r.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
	var u Usuario
	err = json.Unmarshal(data, &u)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
	c := appengine.NewContext(r)
	key := datastore.NewKey(c, "Paciente", "", u.Identificacion, nil)
	_, err = datastore.Put(c, key, &u)
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

	Telefono []int
	Email    string
}

type HistoriaConsulta struct {
	Fecha            time.Time `schema:"-"`
	Usuario          int64     `schema:"-"`
	MotivoConsulta   string
	EnfermedadActual string
	RevisionSistemas string
	ExamenFisico     string
	Analisis         string
	Conducta         string
	Medico           string
}

type Antecedente struct {
	Usuario int64
	Tipo    string
	Detalle string
}
