import { AuthenticationContext } from './authencation.context';
import { FC, ReactNode, useEffect, useMemo, useReducer } from 'react';
import { authenticationReducer } from './authentication.reducer';
import { authenticationInitialState } from './authentication.initial';
import { LoggerFactory } from '@consdata/logger-api';
import {
  browserPopupRedirectResolver,
  getRedirectResult,
  onAuthStateChanged,
} from 'firebase/auth';
import { useFirebaseAuthentication } from '../firebase/use-firebase-authentication';

export interface AuthenticationProviderProps {
  children?: ReactNode;
}

const log = LoggerFactory.getLogger('AuthenticationProvider');

export const AuthenticationProvider: FC<AuthenticationProviderProps> = ({
  children,
}) => {
  const auth = useFirebaseAuthentication();
  const [state, dispatch] = useReducer(
    authenticationReducer,
    authenticationInitialState
  );
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      log.trace(`Auth state changed [user={}]`, user);
      if (user) {
        dispatch({
          type: 'loggedIn',
          user: {
            displayName: user.displayName ?? user.email ?? '?!',
            email: user.email ?? '?!',
            uuid: user.uid,
            avatarUrl: user.photoURL ? user.photoURL : undefined,
          },
        });
      } else {
        getRedirectResult(auth, browserPopupRedirectResolver).then((result) => {
          if (!result) {
            dispatch({
              type: 'loggedOut',
            });
          }
        });
      }
    });
    return () => unsubscribe();
  }, [auth]);
  const context = useMemo(() => ({ state, dispatch }), [state, dispatch]);
  return (
    <AuthenticationContext.Provider value={context}>
      {children}
    </AuthenticationContext.Provider>
  );
};
