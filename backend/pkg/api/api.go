package api

import (
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"pizzeria/pkg/config"
	"pizzeria/pkg/db"
	"pizzeria/pkg/handlers"
	"pizzeria/pkg/mail"
	"pizzeria/pkg/repository"
)

func New(cfg *config.Config, db *db.DB, mail mail.Service) (*echo.Echo, error) {
	e := echo.New()
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowCredentials: true,
	}))

	e.Pre(middleware.RemoveTrailingSlash())

	e.Debug = true

	menu, err := repository.NewMenuItemsRepository(db)
	if err != nil {
		return nil, err
	}

	users, err := repository.NewUsersRepo(db)
	if err != nil {
		return nil, err
	}

	orders, err := repository.NewOrdersRepo(db)
	if err != nil {
		return nil, err
	}

	handlers.NewMenuHandler(e.Group("menu"), menu)
	handlers.NewAuthHandler(e.Group("auth"), cfg, users, mail)
	handlers.NewCartHandler(e.Group("cart"), orders)

	if err != nil {
		return nil, err
	}

	return e, nil
}
