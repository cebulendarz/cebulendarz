import Container from '@mui/material/Container';
import {Layout} from '../ui-elements/layout';
import {useParams} from 'react-router-dom';
import {Alert, CircularProgress} from '@mui/material';
import {Ical} from '../ical/ical';
import {useMeetingByInvite} from "../invite/use-meeting-by-invite";

export const Booking = () => {
  const {inviteId, slotId} = useParams<{ inviteId: string, slotId: string }>();

  const [meeting, error] = useMeetingByInvite(inviteId);
  const booking = slotId && meeting?.bookings[slotId];
  const slot = slotId && meeting?.slots.find(s => s.id === slotId);

  if (error) {
    return <Layout>
      <Alert severity="error">{error}</Alert>
    </Layout>;
  } else if (meeting && slot && booking) {
    return <Layout>
      <Container maxWidth="sm">
        <h1>{booking.userName}, jesteśmy umówieni!</h1>
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
      <CircularProgress/>
    </Layout>
  }
}

