import { ReactNode, FC, useState, useCallback, useEffect } from 'react';
import { AppThemeModeContext } from './app-theme-mode.context';
import { PaletteMode } from '@mui/material';

export interface AppThemeModeProviderProps {
  children?: ReactNode;
}

export const AppThemeModeProvider: FC<AppThemeModeProviderProps> = ({
  children,
}) => {
  const [mode, setMode] = useState<PaletteMode>(
    localStorage.getItem('theme') === 'dark' ? 'dark' : 'light'
  );
  const toggleTheme = useCallback(() => {
    setMode(mode === 'dark' ? 'light' : 'dark');
  }, [setMode, mode]);
  useEffect(() => localStorage.setItem('theme', mode), [mode]);
  return (
    <AppThemeModeContext.Provider
      value={{
        theme: mode,
        toggle: toggleTheme,
      }}
    >
      {children}
    </AppThemeModeContext.Provider>
  );
};
