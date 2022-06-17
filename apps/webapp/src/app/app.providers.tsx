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
import { ThemeModeProvider } from './theme/theme-mode.context';
import { useTheme } from './theme/use-theme';

dayjs.locale('pl');
dayjs.extend(toArray);

export const AppProviders: FC<{
  children?: ReactNode;
}> = ({ children }) => {
  const [theme, themeMode] = useTheme();

  return (
    <FirebaseContext.Provider value={firebaseApp}>
      <AuthenticationProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <ThemeModeProvider
            mode={theme.palette.mode}
            themeModeChange={themeMode.change}
          >
            <ThemeProvider theme={theme}>
              <CssBaseline />
              {children}
            </ThemeProvider>
          </ThemeModeProvider>
        </LocalizationProvider>
      </AuthenticationProvider>
    </FirebaseContext.Provider>
  );
};
