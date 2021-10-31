import React, { FC } from "react";

import IMenuItem from "~/interfaces/IMenuItem";

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import IconButton from "@mui/material/IconButton";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

type Props = {
  item: IMenuItem;
  handleAddToCart: (clickedItem: IMenuItem) => void;
}

const MenuItem: FC<Props> = ({ item, handleAddToCart }) => {
  return (
    <Card style={{width: "200px"}}>
      <CardMedia 
        component="img"
        height="150px"
        image={item.image_url}
        alt={item.name}
      />
      <CardContent>
        <Typography variant="h5" component="div">{item.name}</Typography>
        <Typography variant="body2" color="text.secondary">{item.description}</Typography>
      </CardContent>
      <CardActions>
        <IconButton color="success" onClick={() => handleAddToCart(item)}><AddShoppingCartIcon /></IconButton>
        <Typography variant="h6">${item.price}</Typography>
      </CardActions>
    </Card>
  )
}

export default MenuItem