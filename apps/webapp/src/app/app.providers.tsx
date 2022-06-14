import { FC, ReactNode } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { firebaseApp } from './firebase/firebase.app';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { FirebaseContext } from './firebase/firebase.context';
import { AuthenticationProvider } from './auth/authentication.provider';
import { LocalizationProvider } from '@mui/x-date-pickers';
import CssBaseline from '@mui/material/CssBaseline';

import 'dayjs/locale/pl';
import dayjs from 'dayjs';
import toArray from 'dayjs/plugin/toArray';
import { ThemeModeContext } from './theme/theme-mode.context';
import { useThemeMode } from './theme/use-theme-mode';
import { useTheme } from './theme/use-theme';

dayjs.locale('pl');
dayjs.extend(toArray);

export const AppProviders: FC<{
  children?: ReactNode;
}> = ({ children }) => {
  const [mode, themeMode] = useThemeMode();
  const [theme] = useTheme(mode);

  return (
    <FirebaseContext.Provider value={firebaseApp}>
      <AuthenticationProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <ThemeModeContext.Provider value={themeMode}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              {children}
            </ThemeProvider>
          </ThemeModeContext.Provider>
        </LocalizationProvider>
      </AuthenticationProvider>
    </FirebaseContext.Provider>
  );
};
