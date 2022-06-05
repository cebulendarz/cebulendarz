import { FC } from 'react';
import { LoginButton } from './login-button';

export interface LoginGoogleProps {
  onCredentials: () => void;
}

export const LoginGoogle: FC<LoginGoogleProps> = () => (
  <LoginButton disabled={true}>Google</LoginButton>
);
