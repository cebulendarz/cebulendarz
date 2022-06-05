import { AuthenticationContext } from './authencation.context';
import { FC, ReactNode, useEffect, useMemo, useReducer } from 'react';
import { authenticationReducer } from './authentication.reducer';
import { authenticationInitialState } from './authentication.initial';
import { AuthenticationStatus } from './authentication.state';
import { v4 } from 'uuid';
import { LoggerFactory } from '@consdata/logger-api';

export interface AuthenticationProviderProps {
  children?: ReactNode;
}

const log = LoggerFactory.getLogger('AuthenticationProvider');

export const AuthenticationProvider: FC<AuthenticationProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(
    authenticationReducer,
    authenticationInitialState,
    (initial) => {
      const name = localStorage.getItem('user-name');
      if (name) {
        return {
          state: AuthenticationStatus.Logged,
          user: {
            name,
            uuid: localStorage.getItem('user-session-uuid') ?? v4(),
          },
        };
      } else {
        return initial;
      }
    }
  );
  useEffect(() => {
    log.debug('User update [user={}]', state.user);
    if (state.user) {
      localStorage.setItem('user-name', state.user.name);
      localStorage.setItem('user-session-uuid', state.user.uuid);
    } else {
      localStorage.removeItem('user-name');
      localStorage.removeItem('user-session-uuid');
    }
  }, [state.user]);
  const context = useMemo(() => ({ state, dispatch }), [state, dispatch]);
  return (
    <AuthenticationContext.Provider value={context}>
      {children}
    </AuthenticationContext.Provider>
  );
};
