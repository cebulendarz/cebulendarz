import {Layout} from "../ui-elements/layout";
import {useParams} from "react-router-dom";
import {useCallback, useEffect, useState} from "react";
import {Button, CircularProgress, Link, Snackbar, TextField} from "@mui/material";
import {useFirestore} from "../firebase/use-firestore";
import {Meeting, MeetingSlot} from "../meeting/meeting";
import {doc, onSnapshot, setDoc} from "firebase/firestore";
import {AddSlotsComponent} from "../add-slots/add-slots-component";
import styled from "@emotion/styled";
import {v4} from "uuid";
import {type Firestore} from 'firebase/firestore';

// eslint-disable-next-line no-restricted-globals
const appPath = location.protocol + '//' + location.host;

function subscribeToMeetingDocument(db: Firestore, meetingId: string, setMeeting: (meeting: Meeting) => void) {
  const unsubscribe = onSnapshot(doc(db, 'meetings', meetingId), (doc: any) => {
    const meeting = {...doc.data() as Meeting};
    ensureAtLeastOneEmptySlot(meeting);
    setMeeting({
      ...meeting,
      id: meetingId,
      slots: normalizeSlots(meeting.slots)
    });
  })
  return () => unsubscribe();
}

async function saveMeeting(db: Firestore, meeting: Meeting, done: () => void) {
  try {
    const meetingToSave = {
      ...meeting,
      slots: meeting.slots.filter(slot => !!slot.date)
    };
    await setDoc(doc(db, 'meetings', meetingToSave.id!), meetingToSave)
    done();
  } catch (error) {
    console.error(error);
    alert('Nie udało się zapisać');
  }
}

export const MeetingEdit = () => {
  const db = useFirestore();
  const {meetingId} = useParams<{ meetingId: string }>();
  const [meeting, setMeeting] = useState<Meeting>();
  const [dirty, setDirty] = useState<boolean>(false);
  const [inSave, setInSave] = useState<boolean>(false);

  useEffect(() => {
    if (meetingId) {
      return subscribeToMeetingDocument(db, meetingId, setMeeting);
    } else {
      return undefined;
    }
  }, [meetingId]);

  const onSave = useCallback(
    async (done: () => void) => {
      if (meeting && meeting.id) {
        setInSave(true);
        setDirty(false);
        await saveMeeting(db, meeting, () => {
          setInSave(false);
          done();
        });
      }
    },
    [setDirty, setInSave, meeting]
  );

  const onMeetingChanged = (changed: Partial<Meeting>) => {
    setMeeting(prev => ensureAtLeastOneEmptySlot({
      ...prev,
      ...changed
    } as Meeting));
    setDirty(true);
  };

  return <Layout>
    {!meeting && <LoadingScreen/>}
    {meeting && <>
      <FormRow>
        <MeetingTitleEditor meeting={meeting} editor={onMeetingChanged}/>
      </FormRow>
      <FormRow>
        <MeetingOrganizerEditor meeting={meeting} editor={onMeetingChanged}/>
      </FormRow>
      <FormRow>
        <MeetingSlotsEditor meeting={meeting} editor={onMeetingChanged}/>
      </FormRow>
      <FormRow>
        <MeetingInviteUrl meeting={meeting}/>
      </FormRow>
      <FormRow>
        <MeetingSaveAction dirty={dirty} inSave={inSave} onSave={onSave}/>
      </FormRow>
    </>}
  </Layout>;
}

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

const ensureAtLeastOneEmptySlot = (meeting: Meeting): Meeting => {
  if (meeting.slots.length === 0 || !!meeting.slots[meeting.slots.length - 1].date) {
    meeting.slots.push({id: v4(), date: '', timeFrom: '', timeTo: ''});
  }
  return meeting;
}

type OnMeetingChanged = (changed: Partial<Meeting>) => void;

function normalizeSlots(slots: MeetingSlot[]) {
  return slots.map(slot => ({
    ...slot,
    id: slot.id ?? v4(),
    date: slot.date ?? '',
    timeFrom: slot.timeFrom ?? '',
    timeTo: slot.timeTo ?? ''
  }));
}

const MeetingTitleEditor = ({meeting, editor}: { meeting: Meeting, editor: OnMeetingChanged }) =>
  <StyledTextField label="Nazwa spotkania"
                   variant="outlined"
                   value={meeting.title ?? ''}
                   onChange={changed => editor({
                     title: changed.target.value
                   })}
  />;

const MeetingOrganizerEditor = ({meeting, editor}: { meeting: Meeting, editor: OnMeetingChanged }) =>
  <StyledTextField label="Organizator"
                   variant="outlined"
                   value={meeting.organizerName ?? ''}
                   onChange={changed => editor({
                     organizerName: changed.target.value
                   })}
  />;

const MeetingSlotsEditor = ({meeting, editor}: { meeting: Meeting, editor: OnMeetingChanged }) =>
  <AddSlotsComponent
    slots={meeting.slots}
    slotChanged={event => editor({
      slots: meeting.slots.map(slot => slot.id === event.slotId ? {
        ...slot,
        date: event.date ? event.date : slot.date,
        timeFrom: event.timeFrom ? event.timeFrom : slot.timeFrom,
        timeTo: event.timeTo ? event.timeTo : slot.timeTo,
      } : slot)
    })}
    slotRemoved={id => editor({
      slots: meeting.slots.filter(slot => slot.id !== id)
    })}
  />;

const MeetingInviteUrl = ({meeting}: { meeting: Meeting }) => {
  const inviteUrl = meeting ? `${appPath}/meeting/join/${meeting.inviteId}` : 'loading...';
  return <StyledLink href={inviteUrl}>{inviteUrl}</StyledLink>;
};

const MeetingSaveAction = ({
                             onSave,
                             dirty,
                             inSave
                           }: { onSave: (done: () => void) => void, dirty: boolean, inSave: boolean }) => {
  const [saveSnackbar, setSaveSnackbar] = useState<boolean>(false);
  return <div>
    <Button variant="contained" onClick={() => onSave(() => setSaveSnackbar(true))} disabled={!dirty || inSave}>
      Zapisz
    </Button>
    <Snackbar
      open={saveSnackbar}
      onClose={() => setSaveSnackbar(false)}
      autoHideDuration={5000}
      message="Zapisano!"
    />
  </div>;
}
