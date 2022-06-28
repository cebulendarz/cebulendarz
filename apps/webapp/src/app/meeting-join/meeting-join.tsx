import DayJsAdapter from '@date-io/dayjs';
import styled from '@emotion/styled';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { doc, runTransaction } from 'firebase/firestore';
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthenticationUser } from '../auth/authentication.state';
import { useAuthentication } from '../auth/use-authentication';
import { useDocumentTitle } from '../document-title/use-document-title';
import { useFirestore } from '../firebase/use-firestore';
import { useMeetingByInvite } from '../invite/use-meeting-by-invite';
import { Meeting, MeetingSlot } from '../meeting/meeting';
import { Layout } from '../ui-elements/layout';
import { Switch } from '@mui/material';
import { PartialDeep } from 'type-fest';

const dayjs = new DayJsAdapter();

enum SlotAvailable {
  Booked,
  Locked,
  Available,
  Past,
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
    if (!auth.user) {
      throw new Error(`Can't call without authenticated user`);
    }
    const state = slotState(meeting, slot, auth.user);
    if (state === SlotAvailable.Available) {
      const docRef = doc(db, 'meetings', meeting.id);
      await runTransaction(db, async (transaction) => {
        const doc = await transaction.get(docRef);
        if (!doc.exists()) {
          console.error(`Expected meeting document does not exist! ` + docRef);
          alert('Coś poważnie wybuchło, spójrz w konsolę.');
        } else {
          const existingBooking = doc.data()[`bookings.${slot.id}`];
          if (existingBooking) {
            alert('Niestety, ktoś już zajął ten slot. Spróbuj z innym :)');
          } else {
            if (!auth.user) {
              throw new Error(`Can't call without authenticated user`);
            }
            const update: PartialDeep<Meeting> = {
              bookings: {
                [slot.id]: {
                  name: auth.user.displayName,
                  email: auth.user.email,
                  signDate: new Date().toISOString(),
                },
              },
            };
            transaction.update(docRef, update);
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
  display: flex;
  align-items: center;
  justify-content: space-between;
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

const FilterSwitch = ({
  showPastSlots,
  onClick,
}: {
  showPastSlots: boolean;
  onClick: () => void;
}) => {
  return (
    <FilterSpan onClick={onClick}>
      <Switch size="small" checked={showPastSlots} />
      {showPastSlots ? 'Ukryj przeszłe daty' : 'Pokaż wszystkie daty'}
    </FilterSpan>
  );
};

const FilterSpan = styled.span`
  cursor: pointer;
`;

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
    } else if (
      props.state === SlotAvailable.Booked ||
      props.state === SlotAvailable.Past
    ) {
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
  } else if (isDatePast(slot.date, slot.timeTo)) {
    return SlotAvailable.Past;
  } else {
    return SlotAvailable.Available;
  }
};

const isDatePast = (date: string, time: string): boolean => {
  return dayjs.isBefore(
    dayjs.parse(`${date} ${time}`, 'YYYY-MM-DD H:mm'),
    dayjs.dayjs()
  );
};

const SlotsRow = ({
  meeting,
  reserveSlot,
}: {
  meeting: Meeting;
  reserveSlot: (slot: MeetingSlot) => void;
}) => {
  const [showPastSlots, setShowPastSlots] = useState(false);

  const slotsMap = useMemo(() => {
    if (meeting) {
      return meeting.slots
        .filter((slot) => showPastSlots || !isDatePast(slot.date, slot.timeTo))
        .reduce((map, slot) => {
          map[slot.date] = map[slot.date] || [];
          map[slot.date].push(slot);
          return map;
        }, {} as { [key: string]: MeetingSlot[] });
    } else {
      return {};
    }
  }, [meeting, showPastSlots]);

  const sortedDays = useMemo(
    () => Object.keys(slotsMap).sort((a, b) => a.localeCompare(b)),
    [slotsMap]
  );

  const { state: auth } = useAuthentication();

  return (
    <Row>
      <RowHeader>
        Dostępne terminy
        <FilterSwitch
          showPastSlots={showPastSlots}
          onClick={() => setShowPastSlots(!showPastSlots)}
        />
      </RowHeader>
      <div>
        {sortedDays.map((day) => (
          <SlotDayRow key={day}>
            <SlotDayRowHeader>
              {dayjs.formatByString(dayjs.date(day), 'DD-MM-YYYY')} (
              {dayjs.format(dayjs.date(day), 'weekday')})
            </SlotDayRowHeader>
            <SlotDayRowHourSlots>
              {slotsMap[day].map((slot) => (
                <SlotEntry
                  key={slot.id}
                  state={
                    auth.user && auth.user.verified
                      ? slotState(meeting, slot, auth.user)
                      : SlotAvailable.Locked
                  }
                  onClick={() => auth.user?.verified && reserveSlot(slot)}
                >
                  {slot.timeFrom} - {slot.timeTo}
                  {meeting.bookings[slot.id]?.name &&
                    ` (${meeting.bookings[slot.id]?.name})`}
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
