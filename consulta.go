package hello

import (
	"encoding/json"
	"net/http"
	"time"

	"appengine"
	"appengine/datastore"
)

type HistoriaConsulta struct {
	//Id               int64     `json:"id,omitempty"`
	Fecha            time.Time `json:"fecha,omitempty"`
	Usuario          int64     `json:"usuario"`
	MotivoConsulta   string    `json:"motivo_consulta"`
	EnfermedadActual string    `json:"enfermedad_actual"`
	RevisionSistemas string    `json:"revision_sistemas"`
	ExamenFisico     string    `json:"examen_fisico"`
	Analisis         string    `json:"analisis"`
	Conducta         string    `json:"conducta"`
	IdMedico         int64     `json:"id_medico"`
}

func createHistoriaConsulta(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)

	var hc HistoriaConsulta
	if err := json.NewDecoder(r.Body).Decode(&hc); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	key := datastore.NewKey(c, "Consulta", "", 0, nil)

	if err := datastore.Get(c, key, &hc); err == nil {
		http.Error(w, "Already Exist", http.StatusConflict)
		return
	}

	hc.Fecha = time.Now()

	if _, err := datastore.Put(c, key, &hc); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(hc)

}
