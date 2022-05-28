import {Layout} from "../ui-elements/layout";
import {useParams} from "react-router-dom";
import {useCallback, useEffect, useState} from "react";
import {Alert, CircularProgress, Link, Snackbar, TextField} from "@mui/material";
import {useFirestore} from "../firebase/use-firestore";
import {Meeting, MeetingSlot} from "../meeting/meeting";
import {doc, type Firestore, onSnapshot, setDoc} from "firebase/firestore";
import {SlotsEditor} from "./slots-editor";
import styled from "@emotion/styled";
import {v4} from "uuid";
import {ReplaySubject} from "rxjs";
import {debounceTime} from "rxjs/operators";

// eslint-disable-next-line no-restricted-globals
const appPath = location.protocol + '//' + location.host;

function subscribeToMeetingDocument(db: Firestore, meetingId: string, setMeeting: (meeting: Meeting) => void, setError: (error: string) => void) {
  const unsubscribe = onSnapshot(doc(db, 'meetings', meetingId), (doc: any) => {
    if (doc.exists()) {
      const meeting = {...doc.data() as Meeting};
      setMeeting(ensureAtLeastOneEmptySlot({
        ...meeting,
        id: meetingId,
        slots: normalizeSlots(meeting.slots)
      }));
    } else {
      setError(`Spotkanie o identyfikatorze "${meetingId}" nie istnieje.`)
    }
  })
  return () => unsubscribe();
}

async function saveMeeting(db: Firestore, meeting: Meeting, done: () => void) {
  try {
    const meetingToSave = {
      ...meeting,
      slots: meeting.slots.filter(slot => !!slot.date)
    };
    if (meetingToSave.id) {
      await setDoc(doc(db, 'meetings', meetingToSave.id), meetingToSave)
      done();
    }
  } catch (error) {
    console.error(error);
    alert('Nie udało się zapisać');
  }
}

export const MeetingEdit = () => {
  const db = useFirestore();
  const {meetingId} = useParams<{ meetingId: string }>();
  const [meeting, setMeeting] = useState<Meeting>();
  const [error, setError] = useState<string>();
  const [saveSnackbar, setSaveSnackbar] = useState<boolean>(false);
  const [change$] = useState(new ReplaySubject());

  useEffect(() => {
    if (meetingId) {
      return subscribeToMeetingDocument(db, meetingId, setMeeting, setError);
    } else {
      return undefined;
    }
  }, [db, meetingId]);

  const onMeetingChanged = (changed: Partial<Meeting>) => {
    setMeeting(prev => ensureAtLeastOneEmptySlot({
      ...prev,
      ...changed
    } as Meeting));
    change$.next(undefined);
  };

  const onSave = useCallback(
    async (done: () => void) => {
      if (meeting && meeting.id) {
        await saveMeeting(db, meeting, () => done());
      }
    },
    [db, meeting]
  );

  useEffect(() => {
    const sub = change$
      .pipe(debounceTime(500))
      .subscribe(() => onSave(() => setSaveSnackbar(true)));
    return () => sub.unsubscribe();
  }, [change$, onSave]);

  return <Layout>
    {error && <Alert severity="error">{error}</Alert>}
    {!meeting && !error && <LoadingScreen/>}
    {meeting && !error && <>
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
      <Snackbar
        open={saveSnackbar}
        onClose={(event, reason) => {
          if (reason === 'timeout') {
            setSaveSnackbar(false)
          }
        }}
        autoHideDuration={1000}
        message="Zapisano!"
      />
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

function normalizeSlots(slots: MeetingSlot[] = []) {
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
  <SlotsEditor
    meeting={meeting}
    slots={meeting.slots}
    slotChanged={event => editor({
      slots: meeting.slots.map(slot => slot.id === event.slotId ? {
        ...slot,
        date: event.date !== undefined ? event.date : slot.date,
        timeFrom: event.timeFrom !== undefined ? event.timeFrom : slot.timeFrom,
        timeTo: event.timeTo !== undefined ? event.timeTo : slot.timeTo,
      } : slot)
    })}
    slotRemoved={id => editor({
      slots: meeting.slots.filter(slot => slot.id !== id)
    })}
    slotImported={slots => editor({
      slots: [...filterOutAddPlaceholderSlot(meeting.slots), ...slots.map(slot => ({
        id: v4(),
        date: slot.date ?? '',
        timeFrom: slot.timeFrom ?? '',
        timeTo: slot.timeTo ?? '',
      }))]
    })}
  />;

const MeetingInviteUrl = ({meeting}: { meeting: Meeting }) => {
  const inviteUrl = meeting ? `${appPath}/meeting/join/${meeting.inviteId}` : 'loading...';
  return <StyledLink href={inviteUrl}>{inviteUrl}</StyledLink>;
};

function filterOutAddPlaceholderSlot(slots: MeetingSlot[]) {
  const lastSlot = slots[slots.length - 1];
  if (!lastSlot.date) {
    return slots.slice(0, slots.length - 1);
  } else {
    return slots;
  }
}
