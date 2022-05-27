import {Layout} from "../ui-elements/layout";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Button, CircularProgress, Link, Snackbar, TextField} from "@mui/material";
import {useFirestore} from "../firebase/use-firestore";
import {Meeting} from "../meeting/meeting";
import {onSnapshot, doc, setDoc} from "firebase/firestore";
import {AddSlotsComponent} from "../add-slots/AddSlotsComponent";
import styled from "@emotion/styled";

const StyledLink = styled(Link)`
  cursor: pointer;
`;

const FormRow = styled.div`
  margin-bottom: 16px;
`;

const StyledTextField = styled(TextField)`
  width: 100%;
`;

const LoadingScreen = () => <CircularProgress style={{marginTop: '32px'}}/>;
// eslint-disable-next-line no-restricted-globals
const appPath = location.protocol + '//' + location.host;

export const MeetingEdit = () => {
  const db = useFirestore();
  const {meetingId} = useParams<{ meetingId: string }>();
  const [meeting, setMeeting] = useState<Meeting>();
  const [saveSnackbar, setSaveSnackbar] = useState<boolean>(false);
  const [dirty, setDirty] = useState<boolean>(false);

  useEffect(() => {
    if (meetingId) {
      const meetingDoc = doc(db, 'meetings', meetingId);
      const unsubscribe = onSnapshot(meetingDoc, (doc: any) => setMeeting({
        ...doc.data() as Meeting,
        id: meetingId
      }))
      return () => unsubscribe();
    } else {
      return undefined;
    }
  }, [meetingId]);

  const inviteUrl = meeting ? `${appPath}/meeting/join/${meeting.inviteId}` : 'loading...';

  const onSave = () => {
    const meetingDoc = doc(db, 'meetings', meetingId ?? '');
    setDoc(meetingDoc, meeting)
      .then(result => {
        setSaveSnackbar(true);
        setDirty(false);
      })
      .catch(error => {
        console.error(error);
        alert('Nie udało się zapisać');
      })
  };

  return <Layout>
    {!meeting && <LoadingScreen/>}
    {meeting && <>
      <FormRow>
        <StyledTextField label="Nazwa spotkania"
                   variant="outlined"
                   value={meeting.title ?? ''}
                   onChange={change => {
                     setMeeting({
                       ...meeting,
                       title: change.target.value
                     });
                     setDirty(true);
                   }}
        />
      </FormRow>
      <FormRow>
        <StyledTextField label="Organizator"
                   variant="outlined"
                   value={meeting.organizerName ?? ''}
                   onChange={change => {
                     setMeeting({
                       ...meeting,
                       organizerName: change.target.value
                     });
                     setDirty(true);
                   }}
        />
      </FormRow>
      <FormRow>
        <AddSlotsComponent
          slots={meeting.slots}
          slotChanged={(event) => console.log(event)}
          slotRemoved={(id) => console.log('remove slot %o', id)}
        />
      </FormRow>
      <FormRow>
        <StyledLink href={inviteUrl}>{inviteUrl}</StyledLink>
      </FormRow>
      <FormRow>
        <Button variant="contained" onClick={onSave} disabled={!dirty}>
          Zapisz
        </Button>
        <Snackbar
          open={saveSnackbar}
          onClose={() => setSaveSnackbar(false)}
          autoHideDuration={5000}
          message="Zapisano!"
        />
      </FormRow>
    </>}
  </Layout>;

}
