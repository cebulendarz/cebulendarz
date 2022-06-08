import { AuthenticationUser } from './authentication.state';
import { type User } from 'firebase/auth';

export type AuthenticationAction =
  | { type: 'loggedIn'; user: AuthenticationUser; firebaseUser: User }
  | { type: 'loggedOut' };
