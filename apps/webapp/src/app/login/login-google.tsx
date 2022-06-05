import { FC, useCallback } from 'react';
import { LoginButton } from './login-button';
import { useFirebaseAuthentication } from '../firebase/use-firebase-authentication';
import { GoogleAuthProvider, signInWithRedirect } from 'firebase/auth';

export const LoginGoogle: FC = () => {
  const auth = useFirebaseAuthentication();
  const loginWithGoogle = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    await signInWithRedirect(auth, provider);
  }, [auth]);
  return <LoginButton onClick={loginWithGoogle}>Google</LoginButton>;
};
