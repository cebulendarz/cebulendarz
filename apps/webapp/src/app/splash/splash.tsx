import styled from '@emotion/styled';
import { Layout } from '../ui-elements/layout';
import { Link as RouterLink } from 'react-router-dom';
import Button from '@mui/material/Button';
import { useAuthentication } from '../auth/use-authentication';

const StyledRouterLink = styled(RouterLink)`
  text-decoration: none;
`;

export const Splash = () => {
  const { state: auth } = useAuthentication();
  return (
    <Layout>
      <div>
        <StyledRouterLink to={'/meeting/add'}>
          <Button disabled={!auth.user?.verified}>stwórz wydarzenie</Button>
        </StyledRouterLink>
      </div>
    </Layout>
  );
};
