import { Layout } from '../ui-elements/layout';
import { LoginSlack } from './login-slack';
import { LoginGoogle } from './login-google';
import styled from '@emotion/styled';
import { LoginEmail } from './login-email';

export const Login = () => {
  return (
    <Layout>
      <Panel>
        <LoginEmail />
        <Separator />
        <SocialLogins>
          <div>
            <LoginGoogle />
          </div>
          <div>
            <LoginSlack />
          </div>
        </SocialLogins>
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
  max-width: 300px;
  margin: 0 auto;

  & > * {
    width: 100%;
  }
`;

const SocialLogins = styled.div`
  display: flex;

  & > * {
    width: 140px;
    margin: 0 8px;
  }
`;
