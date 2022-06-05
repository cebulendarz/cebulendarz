import React, { Dispatch } from 'react';
import { AuthenticationState } from './authentication.state';
import { AuthenticationAction } from './authentication.action';

export interface AuthenticationContextType {
  state: AuthenticationState;
  dispatch: Dispatch<AuthenticationAction>;
}

export const AuthenticationContext = React.createContext<
  AuthenticationContextType | undefined
>(undefined);
