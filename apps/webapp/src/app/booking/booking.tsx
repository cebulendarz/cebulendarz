import {useFirestore} from '../firebase/use-firestore';
import {collection, getDocs, query, where} from "firebase/firestore";
import Container from '@mui/material/Container';
import {Layout} from '../ui-elements/layout';
import {useParams} from 'react-router-dom';
import {useEffect, useState} from 'react';
import {Meeting, MeetingSlot} from '../meeting/meeting';
import {CircularProgress} from '@mui/material';
import {createEvent, DateArray} from 'ics'
import moment from 'moment';
import {Ical} from '../ical/ical';

export const Booking = () => {
  const db = useFirestore();
  let {inviteId, slotId} = useParams<{ inviteId: string, slotId: string }>();
  const [meeting, setMeeting] = useState<Meeting>();
  const [slot, setSlot] = useState<MeetingSlot>();

  useEffect(() => {
    if (inviteId && slotId) {
      const meetings = collection(db, "meetings");
      const q = query(meetings, where("inviteId", "==", inviteId));

      getDocs(q).then((result) => {
        if (!result.empty) {
          const meeting = result.docs[0].data() as Meeting;
          setMeeting(meeting);
          const slot = meeting.slots.find((item: any) => item.id === slotId && item.booking);
          setSlot(slot);
        }
      });
    }
  }, [inviteId, slotId]);

  if (meeting && slot) {
    return <Layout>
      <Container maxWidth="sm">
        <h1>{slot?.booking?.userName}, jesteśmy umówieni!</h1>
        <h3>Widzimy się {slot.date} o godzinie {slot.timeFrom}</h3>
        <div>dodaj to wydarzenie do kalendarza:</div>
        <Ical title={meeting.title || 'Spotkanie'}
              description={meeting.description || ''}
              date={slot.date}
              timeFrom={slot.timeFrom}
              timeTo={slot.timeTo}/>
      </Container>
    </Layout>
  } else {
    return <Layout>
      <Container maxWidth="sm">
        <CircularProgress/>
      </Container>
    </Layout>
  }
}

