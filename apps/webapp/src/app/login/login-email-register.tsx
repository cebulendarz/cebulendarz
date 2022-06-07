import styled from '@emotion/styled';
import { Button, TextField } from '@mui/material';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth';
import { useCallback, useState } from 'react';
import { useFirebaseAuthentication } from '../firebase/use-firebase-authentication';
import { LoggerFactory } from '@consdata/logger-api';
import { v4 } from 'uuid';

const log = LoggerFactory.getLogger('LoginEmailRegister');

export const LoginEmailRegister = () => {
  const auth = useFirebaseAuthentication();

  const [email, setEmail] = useState<string>();
  const [emailError, setEmailError] = useState<string>();

  const register = useCallback(async () => {
    if (!email) {
      setEmailError('Podaje poprawny adres email');
    } else {
      setEmailError(undefined);
    }

    if (email) {
      try {
        const tmpPassword = v4();
        const user = await createUserWithEmailAndPassword(
          auth,
          email,
          tmpPassword
        );
        log.info('User registered [user={}]', user);
        await sendEmailVerification(user.user);
        log.info('Password reset link sent [user={}]', user);
      } catch (error: any) {
        log.error(`Error while authenticating`, error);
        if (error.code === 'auth/email-already-in-use') {
          setEmailError(`Podane adres jest już zajęty`);
        } else if (error.code === 'auth/invalid-email') {
          setEmailError(`Niepoprawny adres email`);
        } else {
          setEmailError(`Błąd rejestracji`);
        }
      }
    }
  }, [email, auth]);

  return (
    <Panel>
      <Form onSubmit={(e) => e.preventDefault()}>
        <StyledTextField
          size="small"
          autoComplete="username"
          autoFocus
          value={email ?? ''}
          onChange={(change) => setEmail(change.target.value)}
          label={'Email'}
          error={Boolean(emailError)}
          helperText={emailError}
          onBlur={() => setEmailError(undefined)}
        />
      </Form>
      <div>
        <Button onClick={register}>rejestracja</Button>
      </div>
      <div style={{ fontWeight: 300, fontSize: '0.8em' }}>
        Po utworzeniu konta zostaniesz automatycznie zalogowany. Hasło możessz
        wygenerować w dowolnym momencie korzystając z opcji "Odzyskaj hasło" lub
        "Zmień hasło".
      </div>
    </Panel>
  );
};

const Panel = styled.div`
  display: flex;
  flex-direction: column;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const StyledTextField = styled(TextField)`
  margin-bottom: 16px;
`;
