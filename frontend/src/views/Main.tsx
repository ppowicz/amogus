import React, { useState, useEffect } from "react";
import { getMenu } from "../api"

import IMenuItem from "~/interfaces/IMenuItem";

import { MenuItem } from "../components/MenuItem";
import Container from "@mui/material/Container";

export default function Main() {
  const [menu, setMenu] = useState<IMenuItem[]>(null!);

  useEffect(() => {
    getMenu().then(data => setMenu(data!)).catch(error => console.warn(error))
  }, [])

  return (
    <Container style={{marginTop: "2em"}}>
      {menu != null ? 
        menu.map(item => {
          return <MenuItem {...item} key={item.id} />
        })
      :
        <></>
      }
    </Container>
  )
}