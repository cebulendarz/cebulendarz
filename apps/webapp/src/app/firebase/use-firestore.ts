import React from 'react';
import {FirebaseContext} from './firebase.context';
import {getFirestore} from 'firebase/firestore';

export const useFirestore = () => {
  const context = React.useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseContext');
  }
  return getFirestore(context);
}
