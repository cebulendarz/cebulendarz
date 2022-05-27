import {useFirestore} from '../firebase/use-firestore';
import {collection, getDocs, query, where} from "firebase/firestore";
import Container from '@mui/material/Container';
import {Layout} from '../ui-elements/layout';
import {useParams} from 'react-router-dom';
import {useEffect, useState} from 'react';
import {MeetingSlot} from '../meeting/meeting';
import {CircularProgress} from '@mui/material';

export const Booking = () => {
  const db = useFirestore();
  let {inviteId, slotId} = useParams<{ inviteId: string, slotId: string }>();
  const [slot, setSlot] = useState<MeetingSlot>();

  useEffect(() => {
    if (inviteId && slotId) {
      const meetings = collection(db, "meetings");
      const q = query(meetings, where("inviteId", "==", inviteId));

      getDocs(q).then((result) => {
        if (!result.empty) {
          const slot = result.docs[0].data()['slots'].find((item: any) => item.id === slotId && item.booking);
          setSlot(slot);
        }
      });
    }
  }, [inviteId, slotId]);

  if (slot) {
    return <Layout>
      <Container maxWidth="sm">
        <div>{slot?.booking?.userName}, spotkajmy się!</div>
        <div>{slot.date} {slot.timeFrom}-{slot.timeTo}</div>
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

