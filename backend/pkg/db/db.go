package db

import (
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type DB struct {
	*gorm.DB
}

func New(path string) (*DB, error) {
	d, err := gorm.Open(sqlite.Open(path), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	return &DB{d}, nil
}

func (d *DB) Exists(model interface{}, query interface{}, args ...interface{}) (bool, error) {
	cnt := int64(0)
	err := d.Model(model).Where(query, args...).Count(&cnt).Error
	return cnt > 0, err
}
