import { FC, ReactNode, useMemo } from 'react';
import { createTheme, ThemeProvider } from '@mui/material';
import { useAppTheme } from './use-app-theme';

export interface AppThemeProviderProps {
  children?: ReactNode;
}

export const MuiThemeProvider: FC<AppThemeProviderProps> = ({ children }) => {
  const { theme } = useAppTheme();
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
