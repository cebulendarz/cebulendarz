import { FC, useCallback } from 'react';
import { LoginButton } from './login-button';
import { useFirebaseAuthentication } from '../firebase/use-firebase-authentication';
import { GoogleAuthProvider, signInWithRedirect } from 'firebase/auth';

export interface LoginGoogleProps {
  onCredentials: () => void;
}

export const LoginGoogle: FC<LoginGoogleProps> = () => {
  const auth = useFirebaseAuthentication();
  const loginWithGoogle = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    await signInWithRedirect(auth, provider);
  }, [auth]);
  return <LoginButton onClick={loginWithGoogle}>Google</LoginButton>;
};
