package handlers

import (
	"github.com/badoux/checkmail"
	"github.com/gorilla/sessions"
	"github.com/labstack/echo/v4"
	"github.com/markbates/goth"
	"github.com/markbates/goth/gothic"
	"github.com/markbates/goth/providers/github"
	"github.com/markbates/goth/providers/google"
	gonanoid2 "github.com/matoous/go-nanoid"
	"net/http"
	"pizzeria/pkg/config"
	"pizzeria/pkg/mail"
	"pizzeria/pkg/middleware"
	"pizzeria/pkg/repository"
	"pizzeria/pkg/utils"
)

type AuthHandler struct {
	users     repository.UsersRepo
	mail      mail.Service
	cfg       *config.Config
	providers map[string]string
}

func NewAuthHandler(r *echo.Group, cfg *config.Config, users repository.UsersRepo, mail mail.Service) *AuthHandler {
	h := &AuthHandler{
		users: users,
		mail:  mail,
		cfg:   cfg,
		providers: map[string]string{
			"github": "GitHub",
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

	r.POST("/register", h.register)
	r.POST("/login", h.loginByEmail)
	r.GET("/verify/:code", h.verifyEmail)

	r.GET("/providers", h.getProviders)
	r.GET("/login", h.login)
	r.GET("/callback/:provider", h.callback)
	r.GET("/logout", h.logout)
	r.GET("/me", h.getCurrentUser, middleware.CheckAuth)

	return h
}

func (h *AuthHandler) getCurrentUser(c echo.Context) error {
	u, _ := middleware.GetUserFromContext(c)
	return c.JSON(200, u)
}

// social login

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

	if err := utils.StoreUserInSession(c, u); err != nil {
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

// email login/register

type userAuthBody struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (h *AuthHandler) loginByEmail(c echo.Context) error {
	body := new(userAuthBody)
	if err := c.Bind(body); err != nil {
		return err
	}

	u, err := h.users.GetByEmail(body.Email)
	if err != nil {
		return echo.NewHTTPError(404, "user doesnt exist")
	}

	if !u.Verified {
		return echo.NewHTTPError(403, "email not confirmed")
	}

	if !utils.CheckPasswordHash(body.Password, u.Password) {
		return echo.NewHTTPError(400, "incorrect password")
	}

	return utils.StoreUserInSession(c, u)
}

func (h *AuthHandler) register(c echo.Context) error {
	body := new(userAuthBody)
	if err := c.Bind(body); err != nil {
		return err
	}

	if err := checkmail.ValidateFormat(body.Email); err != nil {
		return echo.NewHTTPError(400, err)
	}

	check, err := h.users.EmailExists(body.Email)
	if err != nil {
		return err
	}

	if check {
		return echo.NewHTTPError(http.StatusConflict, "email already registered")
	}

	passwd, err := utils.HashPassword(body.Password)
	if err != nil {
		return err
	}

	u := repository.User{
		Email:    body.Email,
		Password: passwd,
		Role:     0,
		Verified: false,
	}

	verifyCode, err := gonanoid2.Generate("qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890-=:", 10)
	if err != nil {
		return err
	}

	if _, err = h.users.Create(&u); err != nil {
		return err
	}

	if err := h.users.CreateEmailConfirmation(u.Email, verifyCode); err != nil {
		return err
	}

	if err := h.mail.SendMail(&mail.Mail{
		From:    h.cfg.MailSenderEmail,
		To:      []string{body.Email},
		Subject: "Pizzeria | Confirm your email",
		MType:   mail.TypeConfirmation,
		Data: &mail.Data{
			VerifyURL: h.cfg.ApiUrl + "/auth/verify/" + verifyCode,
		},
	}); err != nil {
		return err
	}

	return c.NoContent(200)
}

func (h *AuthHandler) verifyEmail(c echo.Context) error {
	code := c.Param("code")

	email, err := h.users.ConfirmEmail(code)
	if err != nil {
		return err
	}

	u, err := h.users.GetByEmail(email)
	if err != nil {
		return err
	}

	err = utils.StoreUserInSession(c, u)
	if err != nil {
		return err
	}

	return c.Redirect(http.StatusTemporaryRedirect, h.cfg.FrontUrl)
}
