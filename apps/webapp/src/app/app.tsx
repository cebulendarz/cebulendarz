import styled from '@emotion/styled';
import CssBaseline from '@mui/material/CssBaseline';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import Button from '@mui/material/Button/Button';

const Layout = styled.div`
  margin: 32px auto;
  text-align: center;
  width: 600px;
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
      <>
        <CssBaseline />
        <Layout>
          <div>cebulendarz</div>
          <div><Button variant="outlined">klikaj mocno</Button></div>
        </Layout>
      </>
    </ThemeProvider>
  );
}
