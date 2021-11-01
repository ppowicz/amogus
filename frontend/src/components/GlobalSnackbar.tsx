import React from 'react';
import { globalHook } from '../utils/GlobalHook';
import { useSnackbar } from 'notistack';

const { ref, Provider } = globalHook(useSnackbar);

export { Provider as GlobalSnackbar };

export const snackbar = () => ref.current!;