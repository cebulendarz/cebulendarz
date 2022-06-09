import {
  AuthenticationState,
  AuthenticationStatus,
} from './authentication.state';
import { Reducer } from 'react';
import { AuthenticationAction } from './authentication.action';
import { LoggerFactory } from '@consdata/logger-api';

export type AuthenticationReducer = Reducer<
  AuthenticationState,
  AuthenticationAction
>;

const log = LoggerFactory.getLogger('authenticationReducer');
export const authenticationReducer: AuthenticationReducer = (state, action) => {
  log.trace(`New action [action={}]`, action);
  if (action.type === 'loggedIn') {
    return {
      ...state,
      state: AuthenticationStatus.Logged,
      user: action.user,
      firebaseUser: action.firebaseUser,
    };
  } else if (action.type === 'loggedOut') {
    return {
      ...state,
      state: AuthenticationStatus.NotLogged,
      user: undefined,
      firebaseUser: undefined,
    };
  } else {
    return state;
  }
};
