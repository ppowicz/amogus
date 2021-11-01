import { createTheme, PaletteOptions, ThemeOptions } from '@mui/material/styles';
import { red, pink, grey } from '@mui/material/colors';

export const theme = createTheme(({
	palette: {
		primary: red,
		secondary: pink,
		light: {
			main: red[300]
		}
	},
} as any) as ThemeOptions);
