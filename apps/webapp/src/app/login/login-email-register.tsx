import styled from '@emotion/styled';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth';
import { useCallback, useState } from 'react';
import { useFirebaseAuthentication } from '../firebase/use-firebase-authentication';

export const LoginEmailRegister = () => {
  const auth = useFirebaseAuthentication();

  const [email, setEmail] = useState<string>();
  const [emailError, setEmailError] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [passwordError, setPasswordError] = useState<string>();
  const [passwordCheck, setPasswordCheck] = useState<string>();

  const register = useCallback(async () => {
    if (!email) {
      setEmailError('Podaje poprawny adres email');
    } else {
      setEmailError(undefined);
    }
    if (!password) {
      setPasswordError('Podaj poprawne hasło');
    } else if (password.length < 6) {
      setPasswordError('Hasło musi mieć co najmniej 6 znaków');
    } else if (passwordCheck !== password) {
      setPasswordError('Podane hasła nie są identyczne');
    } else {
      setPasswordError(undefined);
    }

    if (
      email &&
      password &&
      password === passwordCheck &&
      password.length >= 6
    ) {
      try {
        const user = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        console.info('User registered [user=%o]', user);
        await sendEmailVerification(user.user);
        console.info('Password reset link sent [user=%o]', user);
      } catch (error: any) {
        console.error(`Error while authenticating`, error);
        if (error.code === 'auth/email-already-in-use') {
          setEmailError(`Podane adres jest już zajęty`);
        } else if (error.code === 'auth/invalid-email') {
          setEmailError(`Niepoprawny adres email`);
        } else if (error.code === 'auth/operation-not-allowed') {
          setEmailError(`Błąd rejestracji`);
        } else if (error.code === 'auth/weak-password') {
          setEmailError(`Podane hasło nie jest wystarczająco złożone`);
        } else {
          setEmailError(`Błąd rejestracji`);
        }
      }
    }
  }, [email, password, passwordCheck, auth]);

  return (
    <Panel>
      <Form onSubmit={(e) => e.preventDefault()}>
        <StyledTextField
          size="small"
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
          value={password ?? ''}
          onChange={(change) => setPassword(change.target.value)}
          type="password"
          label={'Hasło'}
          error={Boolean(passwordError)}
          helperText={passwordError}
          onBlur={() => setPasswordError(undefined)}
        />
        <StyledTextField
          size="small"
          value={passwordCheck ?? ''}
          onChange={(change) => setPasswordCheck(change.target.value)}
          type="password"
          label={'Powtórz hasło'}
          error={Boolean(passwordError)}
          helperText={passwordError}
          onBlur={() => setPasswordError(undefined)}
        />
      </Form>
      <div>
        <Button onClick={register}>rejestracja</Button>
      </div>
      <div style={{ fontWeight: 300, fontSize: '0.8em' }}>
        Po utworzeniu konta zostaniesz automatycznie zalogowany, a na podany
        adres email zostanie wysłany link weryfikujący konto.
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
