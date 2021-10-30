import React, { FC } from 'react'
import IMenuItem from '~/interfaces/IMenuItem'

import Container from '@mui/material/Container'
import CartItem from './CartItem'
import { Wrapper } from '../../styles/Cart.styles'

type Props = {
    cartItems: IMenuItem[];
    addToCart: (clickedItem: IMenuItem) => void;
    removeFromCart: (id: number) => void;
}

const Cart: FC<Props> = ({ cartItems, addToCart, removeFromCart }) => {
    const calculateTotal = (items: IMenuItem[]) =>
    items.reduce((ack: number, item) => ack + item.amount * item.price, 0);

    return(
        <Wrapper>
            <h2>Your shopping cart</h2>
            {cartItems.length === 0 ? <p>No items in cart.</p> : null}
            {cartItems.map(item => (
                <CartItem
                key={item.id}
                item={item}
                addToCart={addToCart}
                removeFromCart={removeFromCart}
                />
            ))}
            <h2>Total: ${calculateTotal(cartItems).toFixed(2)}</h2>
        </Wrapper>
    )
}

export default Cart