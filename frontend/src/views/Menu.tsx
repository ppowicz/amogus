import React, { useState } from "react";
import { apiPaths, useApi } from "../api";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Cart from "../components/Cart/Cart";

import IMenuItem from "~/interfaces/IMenuItem";

import MenuItem from "../components/MenuItem";
import Container from "@mui/material/Container";
import { Badge, Drawer, IconButton } from "@mui/material";

import { StyledButton, CheckoutButton } from '../styles/Main.styles'
import Grid from "@mui/material/Grid";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

export default function Menu() {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([] as IMenuItem[]);

  const menu = useApi(apiPaths.menu);

  const getTotalItems = (items: IMenuItem[]) =>
    items.reduce((ack: number, item) => ack + item.amount!, 0);

  const handleAddToCart = (clickedItem: IMenuItem) => {
    setCartItems(prev => {
      const isItemInCart = prev.find(item => item.id === clickedItem.id);

      if (isItemInCart) {
        return prev.map(item =>
          item.id === clickedItem.id
            ? { ...item, amount: item.amount! + 1 }
            : item
        );
      }
      return [...prev, { ...clickedItem, amount: 1 }];
    });
  };

  const handleRemoveFromCart = (id: number) => {
    setCartItems(prev =>
      prev.reduce((ack, item) => {
        if (item.id === id) {
          if (item.amount === 1) return ack;
          return [...ack, { ...item, amount: item.amount! - 1 }];
        } else {
          return [...ack, item];
        }
      }, [] as IMenuItem[])
    );
  };

  return (
    <>
      <Grid container spacing={3}>
        {menu.isSuccess  ?
          menu.data.map(item => {
            return <Grid item xs key={item.id}>
              <MenuItem item={item}>
	              <IconButton color="success" onClick={() => handleAddToCart(item)}><AddShoppingCartIcon/></IconButton>
              </MenuItem>
            </Grid>
          })
        :
          <></>
        }
      </Grid>
      <StyledButton color="primary" onClick={() => setCartOpen(true)}>
        <Badge badgeContent={getTotalItems(cartItems)}>
          <ShoppingCartIcon />
        </Badge>
      </StyledButton>
      <Container>
        <Drawer
          anchor='right'
          open={cartOpen}
          onClose={() => setCartOpen(false)}
        >
          <Cart
          cartItems={cartItems}
          addToCart={handleAddToCart}
          removeFromCart={handleRemoveFromCart}
          />
          <CheckoutButton variant="contained">Checkout</CheckoutButton>
        </Drawer>
      </Container>
    </>
  )
}