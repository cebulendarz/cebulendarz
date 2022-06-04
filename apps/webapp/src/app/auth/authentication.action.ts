import { AuthenticationUser } from './authentication.state';

export type AuthenticationAction =
  | { type: 'loggedIn'; user: AuthenticationUser }
  | { type: 'loggedOut' };
