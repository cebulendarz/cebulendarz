import { Layout } from '../ui-elements/layout';
import { LoginEmail } from './login-email';
import { LoginSlack } from './login-slack';
import { LoginGoogle } from './login-google';
import styled from '@emotion/styled';

export const Login = () => {
  return (
    <Layout>
      <Panel>
        <LoginEmail />
        <Separator />
        <LoginGoogle />
        <LoginSlack />
      </Panel>
    </Layout>
  );
};

const Separator = styled.hr`
  width: 100%;
  max-width: 400px;

  display: block;
  height: 1px;
  border: 0;
  border-top: 1px solid #ccc;
  margin: 1em 0;
  padding: 0;
`;

const Panel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  > *:not(last-child) {
    margin-bottom: 12px;
  }
`;
