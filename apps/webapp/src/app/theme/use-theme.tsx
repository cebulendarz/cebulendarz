import { createTheme, Theme } from '@mui/material';

export const useTheme = (
  mode: 'dark' | 'light' | undefined
): [theme: Theme] => {
  const theme = createTheme(
    {
      palette: {
        primary: {
          main: '#b31536',
        },
        secondary: {
          main: '#999999',
        },
        mode: localStorage.getItem('theme') === 'dark' ? 'dark' : 'light',
      },
    },
    [mode]
  );

  return [theme];
};
