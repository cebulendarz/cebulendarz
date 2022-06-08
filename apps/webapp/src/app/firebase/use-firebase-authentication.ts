import {
  browserLocalPersistence,
  indexedDBLocalPersistence,
  initializeAuth,
} from 'firebase/auth';
import { useFirebase } from './use-firebase';
import { useMemo } from 'react';

export const useFirebaseAuthentication = () => {
  const firebase = useFirebase();
  const auth = useMemo(() => {
    return initializeAuth(firebase, {
      persistence: [indexedDBLocalPersistence, browserLocalPersistence],
    });
  }, [firebase]);
  return auth;
};
