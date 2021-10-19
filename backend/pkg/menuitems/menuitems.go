package menuitems

import (
	"github.com/labstack/echo/v4"
	"pizzeria/pkg/db"
)

type Menu struct {
	db *db.DB
}

func New(r *echo.Group, db *db.DB) (*Menu, error) {
	m := &Menu{db}

	if err := db.AutoMigrate(&MenuItem{}); err != nil {
		return nil, err
	}

	r.GET("", m.getMenuItems)

	return m, nil
}

func (m *Menu) getMenuItems(c echo.Context) error {
	var res []MenuItem
	err := m.db.Find(&res).Error
	if err != nil {
		return err
	}

	return c.JSON(200, res)
}
