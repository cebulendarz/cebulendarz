import { FC, ReactNode } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import moment from 'moment';
import { firebaseApp } from './firebase/firebase.app';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { FirebaseContext } from './firebase/firebase.context';
import { AuthenticationProvider } from './auth/authentication.provider';
import { LocalizationProvider } from '@mui/x-date-pickers';
import CssBaseline from '@mui/material/CssBaseline';

moment.locale('pl');

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
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </LocalizationProvider>
      </AuthenticationProvider>
    </FirebaseContext.Provider>
  );
};
