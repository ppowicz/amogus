import styled from 'styled-components';
import { Button, IconButton } from '@mui/material';
import Cart from '../components/Cart/Cart';

export const StyledButton = styled(IconButton)`
  position: fixed;
  z-index: 100;
  right: 20px;
  bottom: 20px;
`;

export const CheckoutButton = styled(Button)`
  position: sticky;
  bottom: 2%;
  width: 80%;
  margin-left: auto;
  margin-right: auto;
  height: auto;
  border-radius: 25px;
`