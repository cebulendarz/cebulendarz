import Container from '@mui/material/Container';
import { Layout } from '../ui-elements/layout';
import { useNavigate, useParams } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { Ical } from '../ical/ical';
import { useMeetingByInvite } from '../invite/use-meeting-by-invite';
import styled from '@emotion/styled';
import { useFirestore } from '../firebase/use-firestore';
import { deleteField, doc, updateDoc } from 'firebase/firestore';
import { useDocumentTitle } from '../document-title/use-document-title';
import { useAuthentication } from '../auth/use-authentication';

const CancelBooking = styled.div`
  color: ${({ theme }) => theme.palette.primary.main};
  cursor: pointer;
`;

export const Booking = () => {
  const { inviteId, slotId } = useParams<{
    inviteId: string;
    slotId: string;
  }>();

  const { state: auth } = useAuthentication();
  const [meeting, error] = useMeetingByInvite(inviteId);
  const booking = slotId ? meeting?.bookings[slotId] : undefined;
  const slot = slotId && meeting?.slots.find((s) => s.id === slotId);
  const navigate = useNavigate();
  const db = useFirestore();
  useDocumentTitle(meeting?.title);

  const onBookingCancel = async () => {
    if (meeting && meeting.id && slotId) {
      const docRef = doc(db, 'meetings', meeting.id);
      await updateDoc(docRef, `bookings.${slotId}`, deleteField());
      navigate(`/meeting/join/${meeting.inviteId}`);
    }
  };

  if (error) {
    return (
      <Layout>
        <Alert severity="error">{error}</Alert>
      </Layout>
    );
  } else if (auth.user?.email !== booking?.email) {
    return (
      <Layout>
        <Alert severity="error">Nie znaleziono rezerwacji.</Alert>
      </Layout>
    );
  } else if (meeting && slot && booking) {
    return (
      <Layout>
        <Container maxWidth="sm">
          <h1>{booking.name ?? booking.userName}, jesteśmy umówieni!</h1>
          <h3>
            Widzimy się {slot.date} o godzinie {slot.timeFrom}
          </h3>
          <div>dodaj to wydarzenie do kalendarza:</div>
          <Ical
            title={meeting.title || 'Spotkanie'}
            description={meeting.description || ''}
            date={slot.date}
            timeFrom={slot.timeFrom}
            timeTo={slot.timeTo}
          />
          <CancelBooking onClick={() => onBookingCancel()}>
            Odwołaj
          </CancelBooking>
        </Container>
      </Layout>
    );
  } else {
    return (
      <Layout>
        <CircularProgress />
      </Layout>
    );
  }
};
