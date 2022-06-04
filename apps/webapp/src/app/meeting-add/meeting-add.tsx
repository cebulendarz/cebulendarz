import { useNavigate } from 'react-router-dom';
import { Layout } from '../ui-elements/layout';
import { CircularProgress } from '@mui/material';
import { useEffect } from 'react';
import { v4 } from 'uuid';
import { useFirestore } from '../firebase/use-firestore';
import { doc, setDoc } from 'firebase/firestore';
import { Meeting } from '../meeting/meeting';
import { LoggerFactory } from '@consdata/logger-api';
import { useAuthentication } from '../auth/use-authentication';

const log = LoggerFactory.getLogger('MeetingAdd');

export const MeetingAdd = () => {
  const navigate = useNavigate();
  const db = useFirestore();
  const { state: auth } = useAuthentication();
  useEffect(() => {
    const id = v4();
    const meetingDoc = doc(db, 'meetings', id);
    const meeting: Meeting = {
      id,
      slots: [],
      title: '',
      inviteId: v4(),
      locks: {},
      bookings: {},
      organizerName: auth.user?.name ?? '',
    };
    setDoc(meetingDoc, meeting)
      .then(() => {
        log.info(`Stworzono wydarzenie: ${meetingDoc.id}`);
        navigate(`/meeting/edit/${meetingDoc.id}`, { replace: true });
      })
      .catch((error) => {
        log.error(error);
        alert('Błąd tworzenia wydarzenia');
      });
  }, [db, navigate]);
  return (
    <Layout>
      <CircularProgress style={{ marginTop: '32px' }} />
    </Layout>
  );
};
