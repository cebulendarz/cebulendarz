import { Button } from '@mui/material';
import { useFirebaseAuthentication } from '../firebase/use-firebase-authentication';
import { useCallback } from 'react';
import { signOut } from 'firebase/auth';
import { useAuthentication } from '../auth/use-authentication';

export const ProfileIcon = () => {
  const auth = useFirebaseAuthentication();
  const { state: authenticated } = useAuthentication();
  const logout = useCallback(() => signOut(auth), [auth]);
  return (
    <div>
      <Button onClick={logout}>
        {authenticated.user?.displayName} (wyloguj)
      </Button>
    </div>
  );
};
