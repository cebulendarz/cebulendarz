import styled from '@emotion/styled';
import CssBaseline from '@mui/material/CssBaseline';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {firebaseApp} from './firebase/firebase.app';
import Button from '@mui/material/Button/Button';
import {FirebaseContext} from './firebase/firebase.context';
import {TestFirebaseButton} from './firebase/test-firebase-button';

const Layout = styled.div`
  margin: 32px auto;
  text-align: center;
  width: 600px;
`;

const SplashLogo = styled.img`
  width: 150px;
`;

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
        <Layout>
          <div>
            <SplashLogo src="assets/cebula.png"/>
          </div>
          <div>
            <TestFirebaseButton/>
          </div>
        </Layout>
      </FirebaseContext.Provider>
    </ThemeProvider>
  );
}
