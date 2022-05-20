import React from 'react';
import type firebase from 'firebase';

export const FirebaseContext = React.createContext<firebase.app.App | undefined>(undefined);
