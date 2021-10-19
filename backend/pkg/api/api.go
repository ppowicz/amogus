package api

import (
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"pizzeria/pkg/db"
	"pizzeria/pkg/menuitems"
)

func New(db *db.DB) (*echo.Echo, error) {
	e := echo.New()

	e.Pre(middleware.RemoveTrailingSlash())

	_, err := menuitems.New(e.Group("menu"), db)
	if err != nil {
		return nil, err
	}

	return e, nil
}
