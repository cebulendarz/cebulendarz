import React from 'react';
import { FirebaseContext } from './firebase.context';

export const useFirebase = () => {
  const context = React.useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseContext');
  }
  return context;
};
