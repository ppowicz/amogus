import React, { useState, useEffect } from "react";
import { getMenu } from "../api"
import { useQuery } from 'react-query';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import Cart from "../components/Cart/Cart";

import IMenuItem from "~/interfaces/IMenuItem";

import MenuItem from "../components/MenuItem";
import Container from "@mui/material/Container";
import { Badge, Drawer, IconButton } from "@mui/material";

import { StyledButton } from '../styles/Main.styles'

export default function Main() {
  const [menu, setMenu] = useState<IMenuItem[]>(null!);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([] as IMenuItem[]);

  const getTotalItems = (items: IMenuItem[]) =>
    items.reduce((ack: number, item) => ack + item.amount, 0);

  const handleAddToCart = (clickedItem: IMenuItem) => {
    setCartItems(prev => {
      const isItemInCart = prev.find(item => item.id === clickedItem.id);

      if (isItemInCart) {
        return prev.map(item =>
          item.id === clickedItem.id
            ? { ...item, amount: item.amount + 1 }
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
          return [...ack, { ...item, amount: item.amount - 1 }];
        } else {
          return [...ack, item];
        }
      }, [] as IMenuItem[])
    );
  };

  useEffect(() => {
    getMenu().then(data => setMenu(data!)).catch(error => console.warn(error))
  }, [])

  return (
    <Container style={{marginTop: "2em"}}>
      {menu != null ? 
        menu.map(item => {
          return <MenuItem item={item} key={item.id} handleAddToCart={handleAddToCart} />
        })
      :
        <></>
      }
      <StyledButton color="primary" onClick={() => setCartOpen(true)}>
        <Badge badgeContent={getTotalItems(cartItems)}>
          <AddShoppingCartIcon />
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
        </Drawer>
      </Container>
    </Container>
  )
}