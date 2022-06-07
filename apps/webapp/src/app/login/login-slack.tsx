import { FC } from 'react';
import { LoginButton } from './login-button';
import styled from '@emotion/styled';

const LogoWrapper = styled.div<{ disabled: boolean }>`
  position: relative;
  display: flex;
  ${(props) =>
    props.disabled &&
    `
     ::after {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(255, 255, 255, .7);
    }
  `}
`;

const LogoImage = styled.img`
  width: 22px;
  height: 22px;
`;

export const LoginSlack: FC = () => (
  <LoginButton
    disabled={true}
    startIcon={
      <LogoWrapper disabled={true}>
        <LogoImage src="assets/slack-logo.svg" />
      </LogoWrapper>
    }
  >
    Slack
  </LoginButton>
);
