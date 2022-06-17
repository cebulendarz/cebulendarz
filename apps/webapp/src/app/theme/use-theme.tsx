import { createTheme, Theme } from '@mui/material';
import { useThemeMode } from './use-theme-mode';

export const useTheme = (): [
  theme: Theme,
  themeMode: { change: () => void }
] => {
  const [mode, themeModeChange] = useThemeMode();
  const theme = createTheme(
    {
      palette: {
        mode: localStorage.getItem('theme') === 'light' ? 'light' : 'dark',
        ...(localStorage.getItem('theme') === 'light'
          ? {
              primary: {
                main: '#b31536',
              },
              secondary: {
                main: '#999999',
              },
            }
          : {
              background: {
                default: '#2b2d30',
              },
              primary: {
                main: '#e73259',
              },
              secondary: {
                main: '#999999',
              },
            }),
      },
    },
    [mode]
  );

  return [theme, themeModeChange];
};
