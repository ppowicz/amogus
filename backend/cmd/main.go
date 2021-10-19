package main

import (
	"log"
	"pizzeria/pkg/api"
	"pizzeria/pkg/db"
)

func handleErr(err error) {
	if err != nil {
		log.Fatalln(err)
	}
}

func main() {
	d, err := db.New("app.db")
	handleErr(err)

	a, err := api.New(d)
	handleErr(err)

	a.Logger.Fatal(a.Start(":8080"))
}
