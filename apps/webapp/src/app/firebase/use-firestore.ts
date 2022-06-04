import { getFirestore } from 'firebase/firestore';
import { useFirebase } from './use-firebase';

export const useFirestore = () => {
  return getFirestore(useFirebase());
};
