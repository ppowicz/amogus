package utils

import (
	"encoding/json"
	"github.com/labstack/echo/v4"
	"github.com/markbates/goth/gothic"
	"pizzeria/pkg/repository"
)

func StoreUserInSession(c echo.Context, u *repository.User) error {
	userStr, err := json.Marshal(u)
	if err != nil {
		return err
	}

	err = gothic.StoreInSession("user", string(userStr), c.Request(), c.Response())
	if err != nil {
		return err
	}

	return nil
}
