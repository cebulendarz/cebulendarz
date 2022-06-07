import { LoginEmailForm } from './login-email-form';
import { Button } from '@mui/material';
import styled from '@emotion/styled';
import { useState } from 'react';

enum LoginView {
  Form,
  Register,
  Reset,
}

export const LoginEmail = () => {
  const [view, setView] = useState<LoginView>(LoginView.Form);
  return (
    <div>
      {view === LoginView.Form && <LoginEmailForm />}
      {view === LoginView.Register && <div>rejestracja</div>}
      {view === LoginView.Reset && <div>odzyskiwanie hasła</div>}
      <Actions>
        {view === LoginView.Form && (
          <>
            <Button size="small" onClick={() => setView(LoginView.Register)}>
              zarejestruj się
            </Button>
            <Button size="small" onClick={() => setView(LoginView.Reset)}>
              odzyskaj hasło
            </Button>
          </>
        )}
        {view !== LoginView.Form && (
          <>
            <Button size="small" onClick={() => setView(LoginView.Form)}>
              wróć
            </Button>{' '}
          </>
        )}
      </Actions>
    </div>
  );
};

const Actions = styled.div`
  margin-top: 8px;

  & > * {
    margin: 0 6px;
  }
`;
