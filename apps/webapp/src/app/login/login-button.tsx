import type { ButtonProps } from '@mui/material';
import Button from '@mui/material/Button';
import { FC, ReactNode } from 'react';
import styled from '@emotion/styled';

export interface LoginButtonProps extends ButtonProps {
  children?: ReactNode;
}

export const LoginButton: FC<LoginButtonProps> = ({ children, ...props }) => {
  return (
    <StyledButton variant="outlined" {...props}>
      {children}
    </StyledButton>
  );
};

const StyledButton = styled(Button)`
  width: 100%;
  max-width: 200px;
  height: 40px;
`;
