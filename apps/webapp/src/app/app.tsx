import 'moment/locale/pl';

import { BrowserRouter } from 'react-router-dom';
import styled from '@emotion/styled';
import { Layout } from './ui-elements/layout';
import { Login } from './login/login';
import { AppRouting } from './app.routing';
import { useAuthentication } from './auth/use-authentication';

const LogoWrapper = styled(Layout)``;

export const App = () => {
  const { state: auth } = useAuthentication();
  return (
    <>
      <LogoWrapper>
        <a href="/">
          <img src="assets/cebula.png" alt="Logo aplikacji" width="100px" />
        </a>
      </LogoWrapper>
      {auth.user && (
        <BrowserRouter>
          <AppRouting />
        </BrowserRouter>
      )}
      {!auth.user && <Login />}
    </>
  );
};
