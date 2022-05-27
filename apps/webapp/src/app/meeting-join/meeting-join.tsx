import {FC, useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {collection, doc, onSnapshot, query, setDoc, where} from "firebase/firestore";
import {useFirestore} from '../firebase/use-firestore';
import {Meeting} from '../meeting/meeting';
import {CircularProgress} from '@mui/material';
import {MeetingSlot} from './meeting-slot';
import {Layout} from '../ui-elements/layout';
import moment from 'moment/moment';

const LoadingScreen = () => <CircularProgress style={{marginTop: '32px'}}/>;

export const MeetingJoin: FC = () => {
  const db = useFirestore();
  const {inviteId} = useParams<{ inviteId: string }>();
  const [meeting, setMeeting] = useState<Meeting>();
  const navigate = useNavigate();

  useEffect(() => {
    if (inviteId) {
      const q = query(collection(db, 'meetings'), where('inviteId', '==', inviteId));
      const unsubscribe = onSnapshot(q, (docs: any) => {
        const meetings: Meeting[] = [];
        console.log(meetings);
        if(meetings.length > 0){
          docs.forEach((d: any) => meetings.push(d.data() as Meeting));
          setMeeting({
            ...meetings[0] as Meeting,
            inviteId: inviteId
          })
        }
      });
      return () => unsubscribe();
    } else {
      return undefined;
    }
  }, [inviteId]);

  const handleBookingSlot = (name: string, slotId: number) => {
    if (meeting) {
      // if (meeting.slots[slotId].lock && meeting.slots[slotId].lock?.user !== "me"){
      //   console.log("Slot is locked by someone else");
      //   return;
      // }
      const collectionReference = doc(db, 'meetings', meeting.id ?? '');
      meeting.slots[slotId].booking = {userName: name};
      setDoc(collectionReference, meeting).then(() => console.log("Zarezerwowałem slot"));
      // navigate("./booking/" + meeting.slots[slotId].id);
    }
  }

  const handleLock = (slotId: number) => {
    if (meeting) {
      if (meeting.slots[slotId].booking && meeting.slots[slotId].booking?.userName) {
        console.log("Zarezerwowane");
        return;
      }
      if (meeting.slots[slotId].lock && !moment(Date.now()).isAfter(meeting.slots[slotId].lock?.expire)) {
        console.log("Lock");
        return;
      }
      const collectionReference = doc(db, 'meetings', meeting.id ?? '');
      meeting.slots[slotId].lock = {user: "", expire: moment(Date.now()).add(30, 'm').toDate()};
      setDoc(collectionReference, meeting).then(() => console.log("Lock na slot"));
    }
  }

  return (
    <Layout>
      {!meeting && <LoadingScreen/>}
      {meeting && <>
        <div>{meeting.title}</div>
        <div>{meeting.description}</div>
        <div>{meeting.organizerName}</div>
        <div>Dostępne terminy</div>
        <div style={{display: 'flex'}}>
          {meeting.slots?.map((slot, index) => <MeetingSlot date={slot.date} timeFrom={slot.timeFrom}
                                                           timeTo={slot.timeTo}
                                                           handleLock={() => handleLock(index)}
                                                           handleBooking={(name: string) => handleBookingSlot(name, index)}/>)}
        </div>
      </>}
    </Layout>
  );
}


