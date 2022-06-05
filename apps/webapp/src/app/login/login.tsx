import { Layout } from '../ui-elements/layout';
import { Button, TextField } from '@mui/material';
import styled from '@emotion/styled';
import { useState } from 'react';
import { useAuthentication } from '../auth/use-authentication';
import { useDocumentTitle } from '../document-title/use-document-title';
import { v4 } from 'uuid';

export const Login = () => {
  const [name, setName] = useState<string>();
  const { dispatch: authDispatch } = useAuthentication();
  useDocumentTitle('Witaj ' + (name ?? ''));
  return (
    <Layout>
      <Row>
        <TextField
          autoFocus
          value={name ?? ''}
          onChange={(change) => setName(change.target.value)}
          label={'Imię i nazwisko'}
        />
      </Row>
      <Row>
        <Button
          onClick={() => {
            if (name) {
              authDispatch({
                type: 'loggedIn',
                user: {
                  name,
                  uuid: v4(),
                },
              });
            } else {
              alert('Nie bądźmy sobie obcy, przedstaw się :)');
            }
          }}
        >
          Zaloguj się
        </Button>
      </Row>
    </Layout>
  );
};

const Row = styled.div`
  margin-top: 16px;
`;
