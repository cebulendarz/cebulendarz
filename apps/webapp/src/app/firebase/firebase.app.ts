import firebase from 'firebase/app';
import 'firebase/firestore';
// import 'firebase/analytics';
// import 'firebase/auth';
// import 'firebase/functions';
// import 'firebase/performance';

import {firebaseConfig} from './firebase.config';

export const firebaseApp = firebase.initializeApp(firebaseConfig);
