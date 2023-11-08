import { Layout } from '../ui-elements/layout';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Link from '@mui/material/Link';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import { useFirestore } from '../firebase/use-firestore';
import { Meeting, MeetingSlot } from '../meeting/meeting';
import { doc, type Firestore, onSnapshot, setDoc } from 'firebase/firestore';
import { SlotsEditor } from './slots-editor';
import styled from '@emotion/styled';
import { v4 } from 'uuid';
import { filter, Subject, switchMap, tap } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { DocumentSnapshot } from '@firebase/firestore';
import { useDocumentTitle } from '../document-title/use-document-title';

// eslint-disable-next-line no-restricted-globals
const appPath = location.protocol + '//' + location.host;

function subscribeToMeetingDocument(
  db: Firestore,
  meetingId: string,
  setMeeting: (meeting: Meeting) => void,
  setError: (error: string) => void,
) {
  const unsubscribe = onSnapshot(
    doc(db, 'meetings', meetingId),
    (doc: DocumentSnapshot) => {
      if (doc.exists()) {
        const meeting = { ...(doc.data() as Meeting) };
        setMeeting(
          ensureAtLeastOneEmptySlot({
            ...meeting,
            id: meetingId,
            slots: normalizeSlots(meeting.slots),
          }),
        );
      } else {
        setError(`Spotkanie o identyfikatorze "${meetingId}" nie istnieje.`);
      }
    },
  );
  return () => unsubscribe();
}

async function saveMeeting(db: Firestore, meeting: Meeting) {
  try {
    const meetingToSave: Meeting = {
      ...meeting,
      modificationDates: {
        ...meeting.modificationDates,
        updated: new Date().toISOString(),
      },
      slots: meeting.slots.filter((slot) => !!slot.date),
    };
    if (meetingToSave.id) {
      await setDoc(doc(db, 'meetings', meetingToSave.id), meetingToSave);
    }
  } catch (error) {
    console.error(error);
    alert('Nie udało się zapisać');
  }
}

export const MeetingEdit = () => {
  const db = useFirestore();
  const { meetingId } = useParams<{ meetingId: string }>();
  const [meeting, setMeeting] = useState<Meeting>();
  const [error, setError] = useState<string>();
  const [saveSnackbar, setSaveSnackbar] = useState<boolean>(false);
  const [change$] = useState(new Subject<Meeting>());
  useDocumentTitle(meeting?.title);

  useEffect(() => {
    if (meetingId) {
      return subscribeToMeetingDocument(db, meetingId, setMeeting, setError);
    } else {
      return undefined;
    }
  }, [db, meetingId]);

  const onMeetingChanged = (changed: Partial<Meeting>) => {
    change$.next(
      ensureAtLeastOneEmptySlot({
        ...meeting,
        ...changed,
      } as Meeting),
    );
  };

  useEffect(() => {
    const sub = change$
      .pipe(
        filter((m) => !!m?.id),
        tap((meeting) => setMeeting(meeting)),
        debounceTime(500),
        switchMap((meeting) => {
          return saveMeeting(db, meeting);
        }),
      )
      .subscribe({
        complete: () => setSaveSnackbar(true),
        error: () => alert('Nie udało się zapisać zmian'),
      });
    return () => sub.unsubscribe();
  }, [db, change$]);

  return (
    <Layout>
      {error && <Alert severity="error">{error}</Alert>}
      {!meeting && !error && <LoadingScreen />}
      {meeting && !error && (
        <>
          <FormRow>
            <MeetingTitleEditor meeting={meeting} editor={onMeetingChanged} />
          </FormRow>
          <FormRow>
            <MeetingSlotsEditor meeting={meeting} editor={onMeetingChanged} />
          </FormRow>
          <FormRow>
            <MeetingInviteUrl meeting={meeting} />
          </FormRow>
          <Snackbar
            open={saveSnackbar}
            onClose={(event, reason) => {
              if (reason === 'timeout') {
                setSaveSnackbar(false);
              }
            }}
            autoHideDuration={1000}
            message="Zapisano!"
          />
        </>
      )}
    </Layout>
  );
};

const StyledLink = styled(Link)`
  cursor: pointer;
`;

const FormRow = styled.div`
  margin-bottom: 16px;
`;

const StyledTextField = styled(TextField)`
  width: 100%;
`;

const LoadingScreen = () => <CircularProgress style={{ marginTop: '32px' }} />;

const ensureAtLeastOneEmptySlot = (meeting: Meeting): Meeting => {
  if (
    meeting.slots.length === 0 ||
    !!meeting.slots[meeting.slots.length - 1].date
  ) {
    meeting.slots.push({ id: v4(), date: '', timeFrom: '', timeTo: '' });
  }
  return meeting;
};

type OnMeetingChanged = (changed: Partial<Meeting>) => void;

function normalizeSlots(slots: MeetingSlot[] = []) {
  return slots.map((slot) => ({
    ...slot,
    id: slot.id ?? v4(),
    date: slot.date ?? '',
    timeFrom: slot.timeFrom ?? '',
    timeTo: slot.timeTo ?? '',
  }));
}

const MeetingTitleEditor = ({
  meeting,
  editor,
}: {
  meeting: Meeting;
  editor: OnMeetingChanged;
}) => (
  <StyledTextField
    label="Nazwa spotkania"
    variant="outlined"
    value={meeting.title ?? ''}
    onChange={(changed) =>
      editor({
        title: changed.target.value,
      })
    }
  />
);

const MeetingSlotsEditor = ({
  meeting,
  editor,
}: {
  meeting: Meeting;
  editor: OnMeetingChanged;
}) => (
  <SlotsEditor
    meeting={meeting}
    slots={meeting.slots}
    slotChanged={(event) =>
      editor({
        slots: meeting.slots.map((slot) =>
          slot.id === event.slotId
            ? {
                ...slot,
                date: event.date !== undefined ? event.date : slot.date,
                timeFrom:
                  event.timeFrom !== undefined ? event.timeFrom : slot.timeFrom,
                timeTo: event.timeTo !== undefined ? event.timeTo : slot.timeTo,
              }
            : slot,
        ),
      })
    }
    slotRemoved={(id) =>
      editor({
        slots: meeting.slots.filter((slot) => slot.id !== id),
      })
    }
    slotImported={(slots) =>
      editor({
        slots: [
          ...filterOutAddPlaceholderSlot(meeting.slots),
          ...slots.map((slot) => ({
            id: v4(),
            date: slot.date ?? '',
            timeFrom: slot.timeFrom ?? '',
            timeTo: slot.timeTo ?? '',
          })),
        ],
      })
    }
  />
);

const MeetingInviteUrl = ({ meeting }: { meeting: Meeting }) => {
  const inviteUrl = meeting
    ? `${appPath}/meeting/join/${meeting.inviteId}`
    : 'loading...';
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
