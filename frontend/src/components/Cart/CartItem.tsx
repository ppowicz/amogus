import React, { FC } from 'react'
import { Button } from '@mui/material';

import IMenuItem from '~/interfaces/IMenuItem'
import { Wrapper } from '../../styles/CartItem.styles'

type Props = {
    item: IMenuItem;
    addToCart: (clickedItem: IMenuItem) => void;
    removeFromCart: (id: number) => void;
};

const CartItem: FC<Props> = ({ item, addToCart, removeFromCart }) => {
  return (
    <Wrapper>
      <div>
        <h3>{item.name}</h3>
        <div className='information'>
          <p>Price: ${item.price}</p>
          <p>Total: ${(item.amount! * item.price).toFixed(2)}</p>
        </div>
        <div className='buttons'>
          <Button
            size='small'
            disableElevation
            variant='contained'
            onClick={() => removeFromCart(item.id!)}
          >
            -
          </Button>
          <p>{item.amount}</p>
          <Button
            size='small'
            disableElevation
            variant='contained'
            onClick={() => addToCart(item)}
          >
            +
          </Button>
        </div>
      </div>
      <img src={item.image_url} alt={item.name}/>
    </Wrapper>
  )
}

export default CartItem;