package menuitems

import "gorm.io/gorm"

type MenuItem struct {
	gorm.Model  `json:"-"`
	ID          uint    `json:"id" gorm:"autoIncrement"`
	Name        string  `json:"name"`
	Description string  `json:"description"`
	ImageURL    string  `json:"image_url"`
	Price       float32 `json:"price"`
}
