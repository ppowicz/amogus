package repository

import (
	"gorm.io/gorm"
	"pizzeria/pkg/db"
	"time"
)

type OrderStatus uint

const (
	OrderCart OrderStatus = iota
	OrderPending
	OrderCompleted
)

type Order struct {
	gorm.Model    `json:"-"`
	ID            uint        `json:"id"`
	UserID        string      `json:"user_id"`
	User          *User       `json:"user,omitempty"`
	DateCreated   time.Time   `json:"date_created"`
	DateCompleted time.Time   `json:"date_completed"`
	Status        OrderStatus `json:"status"`
	Items         []OrderItem `json:"items"`
}

type OrderItem struct {
	gorm.Model `json:"-"`
	ID         uint     `json:"id"`
	OrderID    uint     `json:"-"`
	ItemID     uint     `json:"item_id"`
	Item       MenuItem `json:"item"`
}

type OrdersRepo interface {
	GetUserCart(userID string) (*Order, error)
	CartInsert(userID string, items ...*OrderItem) error
	CartRemove(userID string, orderItemID uint) error
}

type ordersRepo struct {
	db *db.DB
}

func NewOrdersRepo(db *db.DB) (OrdersRepo, error) {
	if err := db.AutoMigrate(&Order{}, &OrderItem{}); err != nil {
		return nil, err
	}

	return &ordersRepo{db: db}, nil
}

func (r *ordersRepo) GetUserCartID(userID string) (uint, error) {
	res := new(Order)
	err := r.db.Where("user_id = ? AND status = ?", userID, OrderCart).First(res).Error
	return res.ID, err
}

func (r *ordersRepo) GetUserCart(userID string) (res *Order, err error) {
	res = new(Order)

	err = r.db.
		Where("user_id = ? AND status = ?", userID, OrderCart).
		Preload("Items").
		First(res).Error

	if err == gorm.ErrRecordNotFound {
		res = &Order{
			UserID: userID,
			// DateCreated: time.Now(),
			Status: OrderCart,
			Items:  []OrderItem{},
		}
		err = r.db.Create(res).Error
	}

	return
}

func (r *ordersRepo) CartInsert(userID string, items ...*OrderItem) error {
	cart, err := r.GetUserCartID(userID)
	if err != nil {
		return err
	}

	for _, x := range items {
		x.OrderID = cart
	}

	if err = r.db.Create(items).Error; err != nil {
		return err
	}

	return nil
}

func (r *ordersRepo) CartRemove(userID string, orderItemID uint) (err error) {
	cart, err := r.GetUserCartID(userID)
	if err != nil {
		return err
	}

	err = r.db.Delete(&OrderItem{}, "order_id = ? and id = ?", cart, orderItemID).Error
	return
}
