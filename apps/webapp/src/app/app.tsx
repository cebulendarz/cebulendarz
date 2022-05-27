import styled from '@emotion/styled';
import CssBaseline from '@mui/material/CssBaseline';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {firebaseApp} from './firebase/firebase.app';
import {FirebaseContext} from './firebase/firebase.context';
import {TestFirebaseButton} from './firebase/test-firebase-button';
import {v4} from 'uuid';

import {
  BrowserRouter,
  Routes,
  Route, Navigate,
} from "react-router-dom";
import {Splash} from "./splash/splash";
import {EventAdd} from "./event-add/event-add";

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
            <Route path="event/add" element={<Navigate replace to={`/event/add/${v4()}`} />}/>
            <Route path="event/add/:eventId" element={<EventAdd/>}/>
            <Route path="event/join" element={<div>do me</div>}/>
          </Routes>
        </BrowserRouter>
      </FirebaseContext.Provider>
    </ThemeProvider>
  );
}
