import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {collection, doc, onSnapshot, query, updateDoc, where, runTransaction} from "firebase/firestore";
import {useFirestore} from '../firebase/use-firestore';
import {Meeting, MeetingSlot} from '../meeting/meeting';
import {CircularProgress} from '@mui/material';
import {Layout} from '../ui-elements/layout';
import moment from 'moment/moment';
import styled from "@emotion/styled";
import {userSession} from "../session/user-session";

export const MeetingJoin = () => {
  const db = useFirestore();
  const {inviteId} = useParams<{ inviteId: string }>();
  const meeting = useMeetingByInvite(inviteId);

  const reserveSlot = async (slot: MeetingSlot) => {
    if (!meeting || !meeting.id) {
      return;
    }
    const state = slotState(meeting, slot);
    if (state === SlotAvailable.Available) {
      const docRef = doc(db, 'meetings', meeting.id)
      await runTransaction(db, async (transaction) => {
        const doc = await transaction.get(docRef);
        if (!doc.exists()) {
          console.error(`Expected meeting document does not exist! ` + docRef);
          alert('Coś poważnie wybuchło, spójrz w konsolę.')
        } else {
          const existingLock = doc.data()[`bookings.${slot.id}`];
          if (existingLock) {
            alert('Niestety, ktoś już zajął ten slot. Spróbuj z innym :)');
          } else {
            transaction.update(docRef, {
              [`bookings.${slot.id}.userName`]: userSession.getUserName()
            });
          }
        }
      });
    }
  };

  return <Layout>
    {meeting && <Panel>
      <TitleRow meeting={meeting}/>
      {meeting.description && <DescriptionRow meeting={meeting}/>}
      <OrganizerRow meeting={meeting}/>
      <SlotsRow meeting={meeting} reserveSlot={reserveSlot}/>
    </Panel>}
    {!meeting && <CircularProgress/>}
  </Layout>
};

function useMeetingByInvite(inviteId?: string) {
  const [meeting, setMeeting] = useState<Meeting>();
  const db = useFirestore();
  useEffect(
    () => {
      if (inviteId) {
        const unsubscribe = onSnapshot(
          query(collection(db, 'meetings'), where('inviteId', '==', inviteId)),
          docs => {
            if (docs.size !== 1) {
              throw new Error('Expected exactly one document for invite id = ' + inviteId);
            }
            setMeeting(docs.docs[0].data() as Meeting);
          });
        return () => unsubscribe();
      } else {
        return undefined;
      }
    },
    [inviteId]
  )
  return meeting;
}


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

const RowValue = styled.div`
`;

const TitleRow = ({meeting}: { meeting: Meeting }) => <Row>
  <RowHeader>Spotkanie</RowHeader>
  <RowValue>{meeting.title}</RowValue>
</Row>;

const DescriptionRow = ({meeting}: { meeting: Meeting }) => <Row>
  <RowHeader>Szczegóły</RowHeader>
  <RowValue>{meeting.description}</RowValue>
</Row>;

const OrganizerRow = ({meeting}: { meeting: Meeting }) => <Row>
  <RowHeader>Organizator</RowHeader>
  <RowValue>{meeting.organizerName}</RowValue>
</Row>;

enum SlotAvailable {
  Booked,
  Locked,
  Available
}

const SlotEntry = styled.div`
  font-style: italic;
  cursor: pointer;

  &:hover {
    color: #b31536;
  }

  color: ${(props: { state: SlotAvailable }) => {
    if (props.state === SlotAvailable.Available) {
      return 'green';
    } else if (props.state === SlotAvailable.Booked) {
      return 'red';
    } else {
      return 'gray';
    }
  }}
`;

const slotState = (meeting: Meeting, slot: MeetingSlot): SlotAvailable => {
  if (meeting.bookings[slot.id]) {
    return SlotAvailable.Booked;
  } else if (!meeting.locks[slot.id]) {
    return SlotAvailable.Available;
  } else {
    const expired = isLockExpired(meeting.locks[slot.id].expire);
    const owner = meeting.locks[slot.id].user === userSession.getSessionId();
    if (expired || owner) {
      return SlotAvailable.Available;
    } else {
      return SlotAvailable.Locked;
    }
  }
}

function isLockExpired(expire: string) {
  return moment(Date.now()).isAfter(expire);
}

const SlotsRow = ({meeting, reserveSlot}: { meeting: Meeting, reserveSlot: (slot: MeetingSlot) => void }) => <Row>
  <RowHeader>Dostępne terminy</RowHeader>
  <div>
    {meeting.slots.map(
      slot => <SlotEntry key={slot.id} state={slotState(meeting, slot)} onClick={() => reserveSlot(slot)}>
        {slot.date}, {slot.timeFrom} - {slot.timeTo}
        {meeting.locks[slot.id]?.expire && !isLockExpired(meeting.locks[slot.id]?.expire) && ` (rezerwacja wygasa ${meeting.locks[slot.id]?.expire})`}
        {meeting.bookings[slot.id]?.userName && ` (zarezerwowane przez ${meeting.bookings[slot.id]?.userName})`}
      </SlotEntry>
    )}
  </div>
</Row>;


