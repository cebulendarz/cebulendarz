import styled from "@emotion/styled";
import {Layout} from "../ui-elements/layout";
import {Link as RouterLink} from "react-router-dom";
import {Button, Link} from "@mui/material";

const SplashLogo = styled.img`
  width: 150px;
`;

const StyledRouterLink = styled(RouterLink)`
  text-decoration: none;
`;

export const Splash = () => <Layout>
  <div>
    <SplashLogo src="assets/cebula.png"/>
  </div>
  <div>
    <StyledRouterLink to={'/meeting/add'}>
      <Button>stwórz wydarzenie</Button>
    </StyledRouterLink>
  </div>
</Layout>;
