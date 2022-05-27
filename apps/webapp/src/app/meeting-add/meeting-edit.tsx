import {Layout} from "../ui-elements/layout";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Button, CircularProgress, Link, Snackbar, TextField} from "@mui/material";
import {useFirestore} from "../firebase/use-firestore";
import {Meeting} from "../meeting/meeting";
import {onSnapshot, doc, setDoc} from "firebase/firestore";
import {AddSlotsComponent} from "../add-slots/AddSlotsComponent";
import styled from "@emotion/styled";
import {v4} from "uuid";

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
      const unsubscribe = onSnapshot(meetingDoc, (doc: any) => {
        const meeting = {...doc.data() as Meeting};
        setMeeting({
          ...meeting,
          id: meetingId,
          slots: meeting.slots.map(slot => ({
            ...slot,
            id: slot.id ?? v4(),
            date: slot.date ?? '',
            timeFrom: slot.timeFrom ?? '',
            timeTo: slot.timeTo ?? ''
          }))
        });
      })
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
          slotChanged={(event) => {
            setMeeting({
              ...meeting,
              slots: meeting.slots.map(slot => {
                if (slot.id === event.slotId) {
                  return {
                    ...slot,
                    date: event.date ? event.date : slot.date,
                    timeFrom: event.timeFrom ? event.timeFrom : slot.timeFrom,
                    timeTo: event.timeTo ? event.timeTo : slot.timeTo,
                  }
                } else {
                  return slot;
                }
              })
            })
            setDirty(true);
          }}
          slotRemoved={(id) => {
            setMeeting({
              ...meeting,
              slots: meeting.slots.filter(slot => slot.id !== id)
            });
            setDirty(true);
          }}
        />
        <Button style={{marginTop: '8px'}} onClick={() => {
          setMeeting({
            ...meeting,
            slots: [...meeting.slots || [], {id: v4(), date: '', timeFrom: '', timeTo: ''}]
          })
        }}>Dodaj slot</Button>
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
