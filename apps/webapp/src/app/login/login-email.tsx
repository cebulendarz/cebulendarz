import { Button, TextField } from '@mui/material';
import styled from '@emotion/styled';
import { FC, useState } from 'react';

export interface LoginEmailProps {
  onCredentials: (email: string, password: string) => void;
}

export const LoginEmail: FC<LoginEmailProps> = ({ onCredentials }) => {
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  return (
    <Panel>
      <TextField
        size="small"
        autoFocus
        value={email ?? ''}
        onChange={(change) => setEmail(change.target.value)}
        label={'Email'}
        sx={{ marginBottom: '8px' }}
      />
      <TextField
        size="small"
        value={password ?? ''}
        onChange={(change) => setPassword(change.target.value)}
        type="password"
        label={'Hasło'}
        sx={{ marginBottom: '8px' }}
      />
      <Button
        onClick={() => {
          if (email && password) {
            onCredentials(email, password);
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
