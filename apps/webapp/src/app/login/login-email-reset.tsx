import styled from '@emotion/styled';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useCallback, useState } from 'react';
import { useFirebaseAuthentication } from '../firebase/use-firebase-authentication';

export const LoginEmailReset = () => {
  const auth = useFirebaseAuthentication();

  const [message, setMessage] = useState<string>();
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
        await sendPasswordResetEmail(auth, email);
        setMessage(
          'Link resetowania hasła zostały wysłany na podany adres email.',
        );
        console.info('Password reset link sent [email=%o]', email);
      } catch (error: any) {
        console.error(`Error while authenticating`, error);
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
    <>
      {message && <div>{message}</div>}
      {!message && (
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
            <Button onClick={register}>resetuj</Button>
          </div>
          <div style={{ fontWeight: 300, fontSize: '0.8em' }}>
            Link do resetowania hasła zostanie wysłany na podany adres email.
          </div>
        </Panel>
      )}
    </>
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
