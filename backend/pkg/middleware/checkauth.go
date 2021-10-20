package middleware

import (
	"encoding/json"
	"github.com/labstack/echo/v4"
	"github.com/markbates/goth/gothic"
	"net/http"
	"pizzeria/pkg/repository"
)

func CheckAuth(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		userStr, err := gothic.GetFromSession("user", c.Request())
		if err != nil || userStr == "" || userStr == "null" {
			return echo.NewHTTPError(http.StatusUnauthorized)
		}

		u := new(repository.User)
		if err := json.Unmarshal([]byte(userStr), u); err != nil {
			return err
		}

		c.Set("user", u)

		return next(c)
	}
}

func GetUserFromContext(c echo.Context) (*repository.User, bool) {
	u, ok := c.Get("user").(*repository.User)
	return u, ok
}
