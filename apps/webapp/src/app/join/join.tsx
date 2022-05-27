import {FC, useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {collection, onSnapshot, query, where} from "firebase/firestore";
import {useFirestore} from '../firebase/use-firestore';
import {Meeting} from '../meeting/meeting';
import {CircularProgress} from '@mui/material';

const LoadingScreen = () => <CircularProgress style={{marginTop: '32px'}}/>;

export const Join: FC = () => {
  const db = useFirestore();
  const {inviteId} = useParams<{ inviteId: string }>();
  const [meeting, setMeeting] = useState<Meeting>();

  useEffect(() => {
    if (inviteId) {
      const q = query(collection(db, 'meetings'), where('inviteId', '==', inviteId));
      const unsubscribe = onSnapshot(q, (docs: any) => {
        const meetings: Meeting[] = [];
        docs.forEach((d: any) => meetings.push(d.data() as Meeting));
        setMeeting({
          ...meetings[0] as Meeting,
          inviteId: inviteId
        })
      });
      return () => unsubscribe();
    } else {
      return undefined;
    }
  }, [inviteId]);

  return (
    <>
      {!meeting && <LoadingScreen/>}
      {meeting && <>
        <div>{meeting.title}</div>
        <div>{meeting.description}</div>
        <div>{meeting.organizerName}</div>
        <div>Dostępne terminy</div>
        {meeting.slots.map(slot => <>
          <div>{slot.timeFrom} - {slot.timeTo}</div>
          <div>{slot.date}</div>
        </>)}
      </>}
    </>
  );
}


