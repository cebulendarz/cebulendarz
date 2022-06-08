import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import styled from '@emotion/styled';
import { FC, useCallback, useState } from 'react';
import { useFirebaseAuthentication } from '../firebase/use-firebase-authentication';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { LoggerFactory } from '@consdata/logger-api';

const log = LoggerFactory.getLogger('LoginEmail');

export const LoginEmailForm: FC = () => {
  const auth = useFirebaseAuthentication();

  const [email, setEmail] = useState<string>();
  const [emailError, setEmailError] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [passwordError, setPasswordError] = useState<string>();

  const loginWithEmail = useCallback(async () => {
    if (!email) {
      setEmailError('Podaje poprawny adres email');
    } else {
      setEmailError(undefined);
    }
    if (!password) {
      setPasswordError('Podaj poprawne hasło');
    } else {
      setPasswordError(undefined);
    }
    if (email && password) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (error) {
        setEmailError(`Niepoprawne dane logowania`);
        log.error(`Error while authenticating`, error);
      }
    }
  }, [email, password, auth]);

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
        <StyledTextField
          size="small"
          autoComplete="current-password"
          value={password ?? ''}
          onChange={(change) => setPassword(change.target.value)}
          type="password"
          label={'Hasło'}
          error={Boolean(passwordError)}
          helperText={passwordError}
          onBlur={() => setPasswordError(undefined)}
        />
      </Form>
      <div>
        <Button onClick={loginWithEmail}>zaloguj</Button>
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
