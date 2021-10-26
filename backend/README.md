# Backend

## Run
`go run cmd/main.go`

## Routes

* `/menu`

  * GET `/` - get all menu items
  
* `/auth`
  * GET `/providers` - get a list of available providers 
  * GET `/login?provider={provider}` - redirects to provider login page
  * GET `/logout`
  * GET `/me` - get current user

* `/cart`
  * GET `/` - view cart for current user
  * POST `/` `{ "item_id": <item id>, "amount": <amount> }` - add an item to cart
  * DELETE `/<id>` - remove an item from cart (id = cartItem.id)