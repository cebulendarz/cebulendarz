import { FC, ReactNode } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { firebaseApp } from './firebase/firebase.app';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { FirebaseContext } from './firebase/firebase.context';
import { AuthenticationProvider } from './auth/authentication.provider';
import { LocalizationProvider } from '@mui/x-date-pickers';
import CssBaseline from '@mui/material/CssBaseline';

import 'dayjs/locale/pl';
import dayjs from 'dayjs';
import toArray from 'dayjs/plugin/toArray';

dayjs.locale('pl');
dayjs.extend(toArray);

const theme = createTheme({
  palette: {
    primary: {
      main: '#b31536',
    },
    secondary: {
      main: '#999999',
    },
  },
});

export const AppProviders: FC<{
  children?: ReactNode;
}> = ({ children }) => {
  return (
    <FirebaseContext.Provider value={firebaseApp}>
      <AuthenticationProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </LocalizationProvider>
      </AuthenticationProvider>
    </FirebaseContext.Provider>
  );
};
