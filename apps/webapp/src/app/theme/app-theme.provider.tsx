import { FC, ReactNode, useMemo } from 'react';
import { createTheme, ThemeProvider } from '@mui/material';
import { useAppThemeMode } from './use-app-theme-mode';

export interface AppThemeProviderProps {
  children?: ReactNode;
}

export const AppThemeProvider: FC<AppThemeProviderProps> = ({ children }) => {
  const { theme: themeMode } = useAppThemeMode();
  const theme = useMemo(
    () =>
      createTheme(
        {
          palette: {
            mode: themeMode,
            background: {
              default: themeMode === 'light' ? undefined : '#2b2d30',
            },
            primary: {
              main: themeMode === 'light' ? '#b31536' : '#e73259',
            },
            secondary: {
              main: themeMode === 'light' ? '#999999' : '#999999',
            },
          },
        },
        [themeMode]
      ),
    [themeMode]
  );
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
