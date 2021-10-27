package repository

import (
	"gorm.io/gorm"
	"pizzeria/pkg/db"
)

type UserRole uint

const (
	RoleClient UserRole = iota
	RoleAdmin
)

type User struct {
	gorm.Model `json:"-"`
	ID         string   `json:"id" gorm:"autoIncrement"`
	Email      string   `json:"email"`
	Password   string   `json:"-"`
	Role       UserRole `json:"role"`
	Verified   bool     `json:"-"`
}

type EmailConfirmation struct {
	gorm.Model `json:"-"`
	ID         string `json:"id"`
	Email      string `json:"email"`
}

type UsersRepo interface {
	GetByEmail(email string) (*User, error)
	EmailExists(email string) (bool, error)
	CreateOrUpdate(user *User) (*User, error)
	Create(user *User) (*User, error)
	CreateEmailConfirmation(email, code string) error
	ConfirmEmail(code string) (string, error)
}

type usersRepo struct {
	db *db.DB
}

func NewUsersRepo(db *db.DB) (UsersRepo, error) {
	if err := db.AutoMigrate(&User{}, &EmailConfirmation{}); err != nil {
		return nil, err
	}
	return &usersRepo{db: db}, nil
}

func (r *usersRepo) GetByEmail(email string) (*User, error) {
	u := new(User)
	if err := r.db.Where("email = ?", email).First(u).Error; err != nil {
		return nil, err
	}
	return u, nil
}

func (r *usersRepo) EmailExists(email string) (bool, error) {
	return r.db.Exists(&User{}, "email = ?", email)
}

func (r *usersRepo) CreateOrUpdate(user *User) (*User, error) {
	res := r.db.Model(user).Where("id = ?", user.ID).Updates(user)
	if res.Error != nil {
		return nil, res.Error
	}

	if res.RowsAffected == 0 {
		return r.Create(user)
	}

	return user, nil
}

func (r *usersRepo) Create(user *User) (*User, error) {
	return user, r.db.Create(user).Error
}

func (r *usersRepo) CreateEmailConfirmation(email, code string) error {
	return r.db.Create(&EmailConfirmation{
		ID:    code,
		Email: email,
	}).Error
}

func (r *usersRepo) ConfirmEmail(code string) (string, error) {
	data := new(EmailConfirmation)
	if err := r.db.Where("id = ?", code).First(data).Error; err != nil {
		return "", err
	}

	err := r.db.Model(&User{}).Where("email = ?", data.Email).Update("verified", true).Error
	if err != nil {
		return "", err
	}

	err = r.db.Delete(&data).Error
	if err != nil {
		return "", err
	}

	return data.Email, nil
}
