import React from 'react';
import type {FirebaseApp} from '@firebase/app';

export const FirebaseContext = React.createContext<FirebaseApp | undefined>(undefined);
