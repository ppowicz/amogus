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
	ID         string   `json:"id"`
	Email      string   `json:"email" gorm:"unique_index"`
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
	CreateOrUpdate(user *User) (*User, error)
}

type usersRepo struct {
	db *db.DB
}

func NewUsersRepo(db *db.DB) (UsersRepo, error) {
	if err := db.AutoMigrate(&User{}); err != nil {
		return nil, err
	}
	return &usersRepo{db: db}, nil
}

func (r *usersRepo) CreateOrUpdate(user *User) (*User, error) {
	res := r.db.Model(user).Where("id = ?", user.ID).Updates(user)
	if res.Error != nil {
		return nil, res.Error
	}

	if res.RowsAffected == 0 {
		return nil, r.db.Create(user).Error
	}

	return user, nil
}
