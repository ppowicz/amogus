package handlers

import (
	"github.com/labstack/echo/v4"
	"pizzeria/pkg/middleware"
	"pizzeria/pkg/repository"
	"strconv"
)

type CartHandler struct {
	orders repository.OrdersRepo
}

func NewCartHandler(r *echo.Group, orders repository.OrdersRepo) *CartHandler {
	h := &CartHandler{
		orders: orders,
	}

	r.Use(middleware.CheckAuth)

	r.GET("", h.cartGet)
	r.POST("", h.cartAddItem)
	r.DELETE("/:id", h.cartRemoveItem)

	return h
}

func (h *CartHandler) cartGet(c echo.Context) error {
	u, _ := middleware.GetUserFromContext(c)
	cart, err := h.orders.GetUserCart(u.ID)
	if err != nil {
		return echo.NewHTTPError(404, err)
	}
	return c.JSON(200, cart)
}

type cartAddItemBody struct {
	ItemID uint `json:"item_id"`
	Amount uint `json:"amount"`
}

func (h *CartHandler) cartAddItem(c echo.Context) error {
	u, _ := middleware.GetUserFromContext(c)

	body := new(cartAddItemBody)
	if err := c.Bind(body); err != nil {
		return echo.NewHTTPError(400, err)
	}

	if body.Amount == 0 {
		body.Amount = 1
	}

	var list []*repository.OrderItem

	for i := 0; i < int(body.Amount); i++ {
		list = append(list, &repository.OrderItem{
			ItemID: body.ItemID,
		})
	}
	if err := h.orders.CartInsert(u.ID, list...); err != nil {
		return err
	}

	cart, err := h.orders.GetUserCart(u.ID)
	if err != nil {
		return err
	}

	return c.JSON(200, cart)
}

func (h *CartHandler) cartRemoveItem(c echo.Context) error {
	u, _ := middleware.GetUserFromContext(c)
	idStr := c.Param("id")
	orderItemID, _ := strconv.ParseUint(idStr, 10, 32)

	if err := h.orders.CartRemove(u.ID, uint(orderItemID)); err != nil {
		return err
	}

	cart, err := h.orders.GetUserCart(u.ID)
	if err != nil {
		return err
	}

	return c.JSON(200, cart)
}
