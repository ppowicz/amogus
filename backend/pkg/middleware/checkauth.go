package middleware

import (
	"encoding/json"
	"errors"
	"github.com/labstack/echo/v4"
	"github.com/markbates/goth/gothic"
	"net/http"
	"pizzeria/pkg/repository"
)

func LoadUserToContext(c echo.Context) error {
	userStr, err := gothic.GetFromSession("user", c.Request())
	if err != nil || userStr == "" || userStr == "null" {
		return echo.NewHTTPError(http.StatusUnauthorized)
	}

	u := new(repository.User)
	if err := json.Unmarshal([]byte(userStr), u); err != nil {
		return err
	}

	c.Set("user", u)
	return nil
}

func CheckAuth(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		if err := LoadUserToContext(c); err != nil {
			return err
		}
		return next(c)
	}
}

func RequireRole(role repository.UserRole) func(next echo.HandlerFunc) echo.HandlerFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			u, ok := GetUserFromContext(c)
			if !ok {
				return errors.New("user not stored in context - probably RequireRole was called before CheckAuth")
			}

			if u.Role < role {
				return echo.NewHTTPError(http.StatusForbidden, "forbidden")
			}

			return next(c)
		}
	}
}

func GetUserFromContext(c echo.Context) (*repository.User, bool) {
	u, ok := c.Get("user").(*repository.User)
	return u, ok
}
