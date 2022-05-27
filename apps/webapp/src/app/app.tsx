import CssBaseline from '@mui/material/CssBaseline';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {firebaseApp} from './firebase/firebase.app';
import {FirebaseContext} from './firebase/firebase.context';

import {
  BrowserRouter,
  Routes,
  Route, Navigate,
} from "react-router-dom";
import {Splash} from "./splash/splash";
import {MeetingEdit} from "./meeting-add/meeting-edit";
import {MeetingAdd} from "./meeting-add/meeting-add";
import {Join} from './join/join';
import {Booking} from './booking/booking'

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
            <Route path="meeting/add" element={<MeetingAdd/>}/>
            <Route path="meeting/edit/:meetingId" element={<MeetingEdit/>}/>
            <Route path="meeting/join">
              <Route path=":inviteId" element={<Join/>}/>
            </Route>
            <Route path="meeting/:inviteId/booking/:slotId" element={<Booking/>}/>
          </Routes>
        </BrowserRouter>
      </FirebaseContext.Provider>
    </ThemeProvider>
  );
}
