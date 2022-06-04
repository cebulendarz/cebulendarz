import {
  AuthenticationState,
  AuthenticationStatus,
} from './authentication.state';

export const authenticationInitialState: AuthenticationState = {
  state: AuthenticationStatus.Pending,
};
