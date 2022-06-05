import { FC } from 'react';
import { LoginButton } from './login-button';

export interface LoginSlackProps {
  onCredentials: () => void;
}

export const LoginSlack: FC<LoginSlackProps> = () => (
  <LoginButton disabled={true}>Slack</LoginButton>
);
