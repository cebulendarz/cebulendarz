import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, runTransaction } from 'firebase/firestore';
import { useFirestore } from '../firebase/use-firestore';
import { Meeting, MeetingSlot } from '../meeting/meeting';
import { Alert, CircularProgress } from '@mui/material';
import { Layout } from '../ui-elements/layout';
import moment from 'moment/moment';
import styled from '@emotion/styled';
import { useMeetingByInvite } from '../invite/use-meeting-by-invite';
import { useAuthentication } from '../auth/use-authentication';
import { AuthenticationUser } from '../auth/authentication.state';
import { useDocumentTitle } from '../document-title/use-document-title';

enum SlotAvailable {
  Booked,
  Locked,
  Available,
}

export const MeetingJoin = () => {
  const db = useFirestore();
  const { inviteId } = useParams<{ inviteId: string }>();
  const [meeting, error] = useMeetingByInvite(inviteId);
  const navigate = useNavigate();
  const { state: auth } = useAuthentication();
  useDocumentTitle(meeting?.title);

  const reserveSlot = async (slot: MeetingSlot) => {
    if (!meeting || !meeting.id) {
      return;
    }
    const state = slotState(meeting, slot, auth.user!);
    if (state === SlotAvailable.Available) {
      const docRef = doc(db, 'meetings', meeting.id);
      await runTransaction(db, async (transaction) => {
        const doc = await transaction.get(docRef);
        if (!doc.exists()) {
          console.error(`Expected meeting document does not exist! ` + docRef);
          alert('Coś poważnie wybuchło, spójrz w konsolę.');
        } else {
          const existingLock = doc.data()[`bookings.${slot.id}`];
          if (existingLock) {
            alert('Niestety, ktoś już zajął ten slot. Spróbuj z innym :)');
          } else {
            transaction.update(docRef, {
              [`bookings.${slot.id}.userName`]: auth.user!.displayName,
            });
            navigate('/meeting/' + meeting.inviteId + '/booking/' + slot.id);
          }
        }
      });
    }
  };

  return (
    <Layout>
      {error && <Alert severity="error">{error}</Alert>}
      {!error && meeting && (
        <Panel>
          <TitleRow meeting={meeting} />
          {meeting.description && <DescriptionRow meeting={meeting} />}
          <OrganizerRow meeting={meeting} />
          <SlotsRow meeting={meeting} reserveSlot={reserveSlot} />
        </Panel>
      )}
      {!error && !meeting && <CircularProgress />}
    </Layout>
  );
};

const Panel = styled.div`
  text-align: initial;
`;

const Row = styled.div`
  margin-bottom: 8px;
`;

const RowHeader = styled.div`
  font-size: 0.7em;
  font-weight: 300;
`;

const RowValue = styled.div``;

const TitleRow = ({ meeting }: { meeting: Meeting }) => (
  <Row>
    <RowHeader>Spotkanie</RowHeader>
    <RowValue>{meeting.title}</RowValue>
  </Row>
);

const DescriptionRow = ({ meeting }: { meeting: Meeting }) => (
  <Row>
    <RowHeader>Szczegóły</RowHeader>
    <RowValue>{meeting.description}</RowValue>
  </Row>
);

const OrganizerRow = ({ meeting }: { meeting: Meeting }) => (
  <Row>
    <RowHeader>Organizator</RowHeader>
    <RowValue>{meeting.organizerName}</RowValue>
  </Row>
);

const SlotEntry = styled.div`
  cursor: ${(props: { state: SlotAvailable }) => {
    return props.state === SlotAvailable.Available ? 'pointer' : 'default';
  }};

  &:hover {
    color: ${(props: { state: SlotAvailable }) => {
      return props.state === SlotAvailable.Available ? '#b31536' : undefined;
    }};
  }

  color: ${(props: { state: SlotAvailable }) => {
    if (props.state === SlotAvailable.Available) {
      return 'green';
    } else if (props.state === SlotAvailable.Booked) {
      return 'lightGray';
    } else {
      return 'gray';
    }
  }};
`;

const slotState = (
  meeting: Meeting,
  slot: MeetingSlot,
  user: AuthenticationUser
): SlotAvailable => {
  if (meeting.bookings[slot.id]) {
    return SlotAvailable.Booked;
  } else if (!meeting.locks[slot.id]) {
    return SlotAvailable.Available;
  } else {
    const expired = isLockExpired(meeting.locks[slot.id].expire);
    const owner = meeting.locks[slot.id].user === user.uuid;
    if (expired || owner) {
      return SlotAvailable.Available;
    } else {
      return SlotAvailable.Locked;
    }
  }
};

function isLockExpired(expire: string) {
  return moment(Date.now()).isAfter(expire);
}

const getDayName = (dayIndex: number) => {
  switch (dayIndex) {
    case 1:
      return 'poniedziałek';
    case 2:
      return 'wtorek';
    case 3:
      return 'środa';
    case 4:
      return 'czwartek';
    case 5:
      return 'piątek';
    case 6:
      return 'sobota';
    case 0:
      return 'niedziela';
    default:
      return '';
  }
};

const SlotsRow = ({
  meeting,
  reserveSlot,
}: {
  meeting: Meeting;
  reserveSlot: (slot: MeetingSlot) => void;
}) => {
  const slotsMap = useMemo(() => {
    if (meeting) {
      return meeting.slots.reduce((map, slot) => {
        map[slot.date] = map[slot.date] || [];
        map[slot.date].push(slot);
        return map;
      }, {} as { [key: string]: MeetingSlot[] });
    } else {
      return {};
    }
  }, [meeting]);

  const sortedDays = useMemo(
    () => Object.keys(slotsMap).sort((a, b) => a.localeCompare(b)),
    [slotsMap]
  );

  const { state: auth } = useAuthentication();

  return (
    <Row>
      <RowHeader>Dostępne terminy</RowHeader>
      <div>
        {sortedDays.map((day) => (
          <SlotDayRow key={day}>
            <SlotDayRowHeader>
              {moment(day).format('DD-MM-YYYY')} (
              {getDayName(moment(day).day())})
            </SlotDayRowHeader>
            <SlotDayRowHourSlots>
              {slotsMap[day].map((slot) => (
                <SlotEntry
                  key={slot.id}
                  state={slotState(meeting, slot, auth.user!)}
                  onClick={() => reserveSlot(slot)}
                >
                  {slot.timeFrom} - {slot.timeTo}
                  {meeting.locks[slot.id]?.expire &&
                    !isLockExpired(meeting.locks[slot.id]?.expire) &&
                    ` (rezerwacja wygasa ${meeting.locks[slot.id]?.expire})`}
                  {meeting.bookings[slot.id]?.userName &&
                    ` (${meeting.bookings[slot.id]?.userName})`}
                </SlotEntry>
              ))}
            </SlotDayRowHourSlots>
          </SlotDayRow>
        ))}
      </div>
    </Row>
  );
};

const SlotDayRow = styled.div`
  margin-bottom: 8px;
`;

const SlotDayRowHeader = styled.div`
  font-weight: 600;
`;

const SlotDayRowHourSlots = styled.div``;
