import styled from '@emotion/styled';
import { Layout } from '../ui-elements/layout';
import { Link as RouterLink } from 'react-router-dom';
import Button from '@mui/material/Button';

const StyledRouterLink = styled(RouterLink)`
  text-decoration: none;
`;

export const Splash = () => {
  return (
    <Layout>
      <div>
        <StyledRouterLink to={'/meeting/add'}>
          <Button>stwórz wydarzenie</Button>
        </StyledRouterLink>
      </div>
    </Layout>
  );
};
