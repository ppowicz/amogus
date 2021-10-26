package api

import (
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"pizzeria/pkg/config"
	"pizzeria/pkg/db"
	"pizzeria/pkg/handlers"
	"pizzeria/pkg/repository"
)

func New(db *db.DB, cfg *config.Config) (*echo.Echo, error) {
	e := echo.New()
	e.Use(middleware.CORS())

	e.Pre(middleware.RemoveTrailingSlash())

	menu, err := repository.NewMenuItemsRepository(db)
	if err != nil {
		return nil, err
	}

	users, err := repository.NewUsersRepo(db)
	if err != nil {
		return nil, err
	}

	handlers.NewMenuHandler(e.Group("menu"), menu)
	handlers.NewAuthHandler(e.Group("auth"), cfg, users)

	if err != nil {
		return nil, err
	}

	return e, nil
}
