import {Layout} from "../ui-elements/layout";
import {Button, TextField} from "@mui/material";
import styled from "@emotion/styled";
import {useState} from "react";
import {userSession} from "../session/user-session";

export const Login = ({onLogin}: { onLogin: (user: string) => void }) => {
  const [name, setName] = useState<string>();
  return <Layout>
    <Row>
      <TextField
        autoFocus
        value={name ?? ''}
        onChange={change => setName(change.target.value)}
        label={'Imię i nazwisko'}/>
    </Row>
    <Row>
      <Button onClick={() => {
        if (name) {
          userSession.setUserName(name);
          onLogin(name);
        } else {
          alert('Nie bądźmy sobie obcy, przedstaw się :)');
        }
      }}>Zaloguj się</Button>
    </Row>
  </Layout>;
}

const Row = styled.div`
  margin-top: 16px;
`;
