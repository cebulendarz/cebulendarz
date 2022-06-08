import { FC, useCallback } from 'react';
import { LoginButton } from './login-button';
import { useFirebaseAuthentication } from '../firebase/use-firebase-authentication';
import {
  browserPopupRedirectResolver,
  GoogleAuthProvider,
  signInWithRedirect,
} from 'firebase/auth';
import styled from '@emotion/styled';

const GoogleLogoImage = styled.img`
  width: 30px;
  height: 30px;
`;

export const LoginGoogle: FC = () => {
  const auth = useFirebaseAuthentication();
  const loginWithGoogle = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    await signInWithRedirect(auth, provider, browserPopupRedirectResolver);
  }, [auth]);
  return (
    <LoginButton
      onClick={loginWithGoogle}
      startIcon={
        <GoogleLogoImage src="assets/google-logo.svg"></GoogleLogoImage>
      }
    >
      Google
    </LoginButton>
  );
};
