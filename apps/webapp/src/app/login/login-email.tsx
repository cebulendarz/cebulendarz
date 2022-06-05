import { Button, TextField } from '@mui/material';
import styled from '@emotion/styled';
import { FC, useState } from 'react';

const disabled = true;
export const LoginEmail: FC = () => {
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  return (
    <Panel>
      <StyledTextField
        disabled={disabled}
        size="small"
        autoFocus
        value={email ?? ''}
        onChange={(change) => setEmail(change.target.value)}
        label={'Email'}
      />
      <StyledTextField
        disabled={disabled}
        size="small"
        value={password ?? ''}
        onChange={(change) => setPassword(change.target.value)}
        type="password"
        label={'Hasło'}
      />
      <Button
        disabled={disabled}
        onClick={() => {
          if (email && password) {
            alert('Not yet implemented, use firebase auth');
          } else {
            alert('Nie bądźmy sobie obcy, przedstaw się :)');
          }
        }}
      >
        Zaloguj się
      </Button>
    </Panel>
  );
};

const Panel = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledTextField = styled(TextField)`
  margin-bottom: 16px;
`;
