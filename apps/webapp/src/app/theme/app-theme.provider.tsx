import {
  ReactNode,
  FC,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import { AppThemeContext } from './app-theme.context';
import { createTheme, PaletteMode } from '@mui/material';

export interface AppThemeProviderProps {
  children?: ReactNode;
}

export const AppThemeProvider: FC<AppThemeProviderProps> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<PaletteMode>(
    localStorage.getItem('theme') === 'dark' ? 'dark' : 'light'
  );
  const toggleThemeMode = useCallback(() => {
    setThemeMode(themeMode === 'dark' ? 'light' : 'dark');
  }, [setThemeMode, themeMode]);
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
  useEffect(() => localStorage.setItem('theme', themeMode), [themeMode]);
  return (
    <AppThemeContext.Provider
      value={{
        theme: theme,
        mode: themeMode,
        darkMode: themeMode === 'dark',
        lightMode: themeMode === 'light',
        toggleMode: toggleThemeMode,
      }}
    >
      {children}
    </AppThemeContext.Provider>
  );
};
