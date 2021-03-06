import React from 'react';
import { createTheme, PaletteMode } from '@mui/material';
import { Theme } from '@mui/material/styles/createTheme';

export interface AppThemeContextType {
  theme: Theme;
  darkMode: boolean;
  lightMode: boolean;
  mode: PaletteMode;
  toggleMode: () => void;
}

export const AppThemeContext = React.createContext<AppThemeContextType>({
  mode: 'light',
  darkMode: false,
  lightMode: false,
  theme: createTheme(),
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  toggleMode: () => {},
});
