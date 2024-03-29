import { useNavigate } from 'react-router-dom';
import { Layout } from '../ui-elements/layout';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect } from 'react';
import { v4 } from 'uuid';
import { useFirestore } from '../firebase/use-firestore';
import { doc, setDoc } from 'firebase/firestore';
import { Meeting } from '../meeting/meeting';
import { useAuthentication } from '../auth/use-authentication';

export const MeetingAdd = () => {
  const navigate = useNavigate();
  const db = useFirestore();
  const { state: auth } = useAuthentication();
  useEffect(() => {
    const id = v4();
    const meetingDoc = doc(db, 'meetings', id);
    if (!auth.user) {
      throw new Error(`Can't call without authenticated user`);
    }
    if (!auth.user.verified) {
      navigate(`/`, { replace: true });
      return;
    }
    const meeting: Meeting = {
      id,
      slots: [],
      title: '',
      inviteId: v4(),
      bookings: {},
      organizer: {
        name: auth.user.displayName,
        email: auth.user.email,
      },
      modificationDates: {
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
      },
    };
    setDoc(meetingDoc, meeting)
      .then(() => {
        console.info(`Stworzono wydarzenie: ${meetingDoc.id}`);
        navigate(`/meeting/edit/${meetingDoc.id}`, { replace: true });
      })
      .catch((error) => {
        console.error(error);
        alert('Błąd tworzenia wydarzenia');
      });
  }, [db, navigate, auth]);
  return (
    <Layout>
      <CircularProgress style={{ marginTop: '32px' }} />
    </Layout>
  );
};
