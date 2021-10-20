package repository

import (
	"gorm.io/gorm"
	"pizzeria/pkg/db"
)

type MenuItem struct {
	gorm.Model  `json:"-"`
	ID          uint    `json:"id" gorm:"autoIncrement"`
	Name        string  `json:"name"`
	Description string  `json:"description"`
	ImageURL    string  `json:"image_url"`
	Price       float32 `json:"price"`
}

type MenuRepo struct {
	db *db.DB
}

func NewMenuItemsRepository(db *db.DB) (*MenuRepo, error) {
	if err := db.AutoMigrate(&MenuItem{}); err != nil {
		return nil, err
	}
	return &MenuRepo{db}, nil
}

func (m *MenuRepo) GetAll() (res []MenuItem, err error) {
	err = m.db.Find(&res).Error
	return
}
