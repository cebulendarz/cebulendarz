import { BrowserRouter } from 'react-router-dom';
import styled from '@emotion/styled';
import { Layout } from './ui-elements/layout';
import { Login } from './login/login';
import { AppRouting } from './app.routing';
import { useAuthentication } from './auth/use-authentication';
import { AuthenticationStatus } from './auth/authentication.state';
import CircularProgress from '@mui/material/CircularProgress';
import { ProfileIcon } from './profile/profile-icon';

const LogoWrapper = styled(Layout)``;

export const App = () => {
  const { state: auth } = useAuthentication();
  return (
    <>
      <LogoWrapper>
        <a href="/">
          <img src="assets/cebula.webp" alt="Logo aplikacji" width="100px" />
        </a>
      </LogoWrapper>
      {auth.state === AuthenticationStatus.Pending && (
        <Layout>
          <CircularProgress />
        </Layout>
      )}
      {auth.state === AuthenticationStatus.Logged && (
        <BrowserRouter>
          <AppRouting />
        </BrowserRouter>
      )}
      {auth.state === AuthenticationStatus.NotLogged && <Login />}
      {auth.state === AuthenticationStatus.Logged && (
        <ProfileIconWrapper>
          <ProfileIcon />
        </ProfileIconWrapper>
      )}
    </>
  );
};

const ProfileIconWrapper = styled.div`
  position: fixed;
  top: 0;
  right: 8px;
`;
