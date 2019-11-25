package main

import (
	"encoding/json"
	"log"
	"math/rand"
	"net/http"
	"time"

	"github.com/gorilla/mux"
)

const (
	size           = 100000
	nameSize       = 15
	maxInt         = 10000
	desriptionSize = 25
)

var letterRunes = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")

func randomString(n int) string {
	b := make([]rune, n)
	for i := range b {
		b[i] = letterRunes[rand.Intn(len(letterRunes))]
	}
	return string(b)
}

func randomInt(n int) int {
	return rand.Intn(n)
}

// Row struct repsrenst a single row in a new table
type Row struct {
	Name        string
	ID          int
	Description string
}

func getDataHandler(w http.ResponseWriter, r *http.Request) {
	data := make([]Row, size, size)
	for i := 0; i < size; i++ {
		data = append(data, Row{
			Name:        randomString(nameSize),
			ID:          randomInt(maxInt),
			Description: randomString(desriptionSize),
		})
	}
	js, err := json.Marshal(data)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(js)
}

func main() {

	r := mux.NewRouter()
	r.HandleFunc("/get_data", getDataHandler)
	srv := &http.Server{
		Handler: r,
		Addr:    "127.0.0.1:8000",
		// Good practice: enforce timeouts for servers you create!
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}

	log.Fatal(srv.ListenAndServe())
}
