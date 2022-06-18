import React from 'react';
import { PaletteMode } from '@mui/material';

export interface AppThemeContextType {
  theme: PaletteMode;
  toggle: () => void;
}

export const AppThemeModeContext = React.createContext<AppThemeContextType>({
  theme: 'light',
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  toggle: () => {},
});
