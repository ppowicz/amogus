package handlers

import (
	"github.com/labstack/echo/v4"
	"pizzeria/pkg/repository"
)

type MenuHandler struct {
	repo *repository.MenuRepo
}

func NewMenuHandler(r *echo.Group, repo *repository.MenuRepo) *MenuHandler {
	m := &MenuHandler{repo}

	r.GET("", m.getMenuItems)
	return m
}

func (m *MenuHandler) getMenuItems(c echo.Context) error {
	res, err := m.repo.GetAll()
	if err != nil {
		return err
	}

	return c.JSON(200, res)
}
