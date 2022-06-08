import Alert from '@mui/material/Alert/Alert';
import Button from '@mui/material/Button';
import { Layout } from '../ui-elements/layout';
import { useCallback, useState } from 'react';
import { sendEmailVerification } from 'firebase/auth';
import { useAuthentication } from './use-authentication';

export const UserNotVerified = () => {
  const [message, setMessage] = useState<string | undefined>();
  const { state: auth } = useAuthentication();
  const resendLink = useCallback(async () => {
    if (auth.firebaseUser) {
      try {
        await sendEmailVerification(auth.firebaseUser);
        setMessage(`Link weryfikacyjny został wysłąny na Twój adres email.`);
      } catch {
        setMessage(
          `Nie można w tej chwili wysłać linku, spróbuj ponownie później.`
        );
      }
    }
  }, [auth]);
  return (
    <Layout>
      <Alert severity="info">
        Nie potwierdziłeś jeszcze swojego adresu email. Część funkcjonalności
        jest dostępna jedynie dla zweryfikowanych kont. Skorzystaj z linku który
        wysłaliśmy do Ciebie w wiadomości żeby dokończy rejestrację konta.
      </Alert>
      <div style={{ fontWeight: '300', fontSize: '0.8em', marginTop: '8px' }}>
        {message && <div>{message}</div>}
        {!message && <Button onClick={resendLink}>wyślij link ponownie</Button>}
      </div>
    </Layout>
  );
};
