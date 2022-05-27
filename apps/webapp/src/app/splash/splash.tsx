import styled from "@emotion/styled";
import {Layout} from "../ui-elements/layout";

const SplashLogo = styled.img`
  width: 150px;
`;

export const Splash = () => <Layout>
  <div>
    <SplashLogo src="assets/cebula.png"/>
  </div>
  <div>
    cebulendarz alfa
  </div>
</Layout>;
