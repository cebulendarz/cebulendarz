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
import {AdapterMoment} from '@mui/x-date-pickers/AdapterMoment';
import {LocalizationProvider} from "@mui/x-date-pickers";
import {Booking} from './booking/booking'
import styled from "@emotion/styled";
import {Layout} from "./ui-elements/layout";
import {MeetingJoin} from './meeting-join/meeting-join';

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

const LogoWrapper = styled(Layout)`
  //position: fixed;
  //top: 8px;
  //left: 8px;
`;

export const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <FirebaseContext.Provider value={firebaseApp}>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <CssBaseline/>
          <LogoWrapper>
            <img src="assets/cebula.png" width="100px" />
          </LogoWrapper>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Splash/>}/>
              <Route path="meeting/add" element={<MeetingAdd/>}/>
              <Route path="meeting/edit/:meetingId" element={<MeetingEdit/>}/>
              <Route path="meeting/join">
                <Route path=":inviteId" element={<MeetingJoin/>}/>
              </Route>
              <Route path="meeting/:inviteId/booking/:slotId" element={<Booking/>}/>
            </Routes>
          </BrowserRouter>
        </LocalizationProvider>
      </FirebaseContext.Provider>
    </ThemeProvider>
  );
}
