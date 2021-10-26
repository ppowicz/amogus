package main

import (
	"log"
	"pizzeria/pkg/api"
	"pizzeria/pkg/config"
	"pizzeria/pkg/db"
	"pizzeria/pkg/mail"
)

func handleErr(err error) {
	if err != nil {
		log.Fatalln(err)
	}
}

func main() {
	cfg, err := config.Load("config.json")
	handleErr(err)

	d, err := db.New("app.db")
	handleErr(err)

	m := mail.NewSGMailService(cfg)

	a, err := api.New(cfg, d, m)
	handleErr(err)

	a.Logger.Fatal(a.Start(":8080"))
}
