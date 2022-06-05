import { Layout } from '../ui-elements/layout';
import { useAuthentication } from '../auth/use-authentication';
import { v4 } from 'uuid';
import { LoginEmail } from './login-email';
import { LoginSlack } from './login-slack';
import { LoginGoogle } from './login-google';
import styled from '@emotion/styled';

export const Login = () => {
  const { dispatch: authDispatch } = useAuthentication();
  return (
    <Layout>
      <Panel>
        <LoginEmail
          disabled={true}
          onCredentials={(email, password) =>
            authDispatch({
              type: 'loggedIn',
              user: {
                name: email,
                uuid: v4(),
              },
            })
          }
        />
        <Separator />
        <LoginGoogle onCredentials={() => {}} />
        <LoginSlack onCredentials={() => {}} />
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

  > *:not(last-child-of) {
    margin-bottom: 12px;
  }
`;
