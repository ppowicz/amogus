package handlers

import (
	"encoding/json"
	"fmt"
	"github.com/gorilla/sessions"
	"github.com/labstack/echo/v4"
	"github.com/markbates/goth"
	"github.com/markbates/goth/gothic"
	"github.com/markbates/goth/providers/github"
	"github.com/markbates/goth/providers/google"
	"net/http"
	"pizzeria/pkg/config"
	"pizzeria/pkg/middleware"
	"pizzeria/pkg/repository"
)

type AuthHandler struct {
	users     *repository.UsersRepo
	cfg       *config.Config
	providers map[string]string
}

func NewAuthHandler(r *echo.Group, cfg *config.Config, users *repository.UsersRepo) *AuthHandler {
	h := &AuthHandler{
		users: users,
		cfg:   cfg,
		providers: map[string]string{
			"github": "Github",
			"google": "Google",
		},
	}

	store := sessions.NewCookieStore([]byte(cfg.JwtSecret))
	store.MaxAge(86400 * 30)
	store.Options.Path = "/"
	store.Options.HttpOnly = true // HttpOnly should always be enabled
	store.Options.Secure = false

	gothic.Store = store

	goth.UseProviders(
		github.New(cfg.GithubClient, cfg.GithubSecret, cfg.ApiUrl+"/auth/callback/github", "user"),
		google.New(cfg.GoogleClient, cfg.GoogleSecret, cfg.ApiUrl+"/auth/callback/google"))

	r.GET("/providers", h.getProviders)
	r.GET("/login", h.login)
	r.GET("/callback/:provider", h.callback)
	r.GET("/logout", h.logout)
	r.GET("/me", h.getCurrentUser, middleware.CheckAuth)

	return h
}

func (h *AuthHandler) getProviders(c echo.Context) error {
	return c.JSON(200, h.providers)
}

func (h *AuthHandler) callback(c echo.Context) error {
	user, err := gothic.CompleteUserAuth(c.Response(), c.Request())
	if err != nil {
		return err
	}

	u, err := h.users.CreateOrUpdate(&repository.User{
		ID:       user.Provider + "_" + user.UserID,
		Email:    user.Email,
		Verified: true,
	})
	if err != nil {
		return err
	}

	userStr, _ := json.Marshal(u)
	err = gothic.StoreInSession("user", string(userStr), c.Request(), c.Response())
	if err != nil {
		return err
	}

	return c.Redirect(http.StatusTemporaryRedirect, h.cfg.FrontUrl)
}

func (h *AuthHandler) logout(c echo.Context) error {
	if err := gothic.Logout(c.Response(), c.Request()); err != nil {
		return err
	}

	return c.Redirect(http.StatusTemporaryRedirect, h.cfg.FrontUrl)
}

func (h *AuthHandler) login(c echo.Context) error {
	if _, err := gothic.CompleteUserAuth(c.Response(), c.Request()); err == nil {
		return c.Redirect(http.StatusTemporaryRedirect, h.cfg.FrontUrl)
	} else {
		gothic.BeginAuthHandler(c.Response(), c.Request())
	}
	return nil
}

func (h *AuthHandler) getCurrentUser(c echo.Context) error {
	u, _ := middleware.GetUserFromContext(c)
	fmt.Println(u.Email)
	return c.JSON(200, u)
}
