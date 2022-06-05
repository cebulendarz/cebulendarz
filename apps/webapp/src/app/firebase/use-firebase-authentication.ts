import { getAuth } from 'firebase/auth';
import { useFirebase } from './use-firebase';

export const useFirebaseAuthentication = () => {
  return getAuth(useFirebase());
};
