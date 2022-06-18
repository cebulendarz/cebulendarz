import { FC, ReactNode } from 'react';
import { firebaseApp } from './firebase/firebase.app';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { FirebaseContext } from './firebase/firebase.context';
import { AuthenticationProvider } from './auth/authentication.provider';
import { LocalizationProvider } from '@mui/x-date-pickers';
import CssBaseline from '@mui/material/CssBaseline';

import 'dayjs/locale/pl';
import dayjs from 'dayjs';
import toArray from 'dayjs/plugin/toArray';
import { AppThemeProvider } from './theme/app-theme.provider';
import { AppThemeModeProvider } from './theme/app-theme-mode.provider';

dayjs.locale('pl');
dayjs.extend(toArray);

export const AppProviders: FC<{
  children?: ReactNode;
}> = ({ children }) => {
  return (
    <FirebaseContext.Provider value={firebaseApp}>
      <AuthenticationProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <AppThemeModeProvider>
            <AppThemeProvider>
              <CssBaseline />
              {children}
            </AppThemeProvider>
          </AppThemeModeProvider>
        </LocalizationProvider>
      </AuthenticationProvider>
    </FirebaseContext.Provider>
  );
};
