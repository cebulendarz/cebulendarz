import styled from '@emotion/styled';
import CssBaseline from '@mui/material/CssBaseline';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {firebaseApp} from './firebase/firebase.app';
import {FirebaseContext} from './firebase/firebase.context';
import {TestFirebaseButton} from './firebase/test-firebase-button';

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import {Splash} from "./splash/splash";

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

export const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <FirebaseContext.Provider value={firebaseApp}>
        <CssBaseline/>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Splash/>}/>
            <Route path="event/add" element={<TestFirebaseButton/>}/>
            <Route path="event/join" element={<div>do me</div>}/>
          </Routes>
        </BrowserRouter>
      </FirebaseContext.Provider>
    </ThemeProvider>
  );
}
