import React from "react";

import IMenuItem from "~/interfaces/IMenuItem";

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import IconButton from "@mui/material/IconButton";
import AddIcon from '@mui/icons-material/Add';

export const MenuItem = (item: IMenuItem) => {
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
        <IconButton color="success"><AddIcon /></IconButton>
      </CardActions>
    </Card>
  )
}