import Button from '@mui/material/Button/Button';
import {doc, setDoc} from 'firebase/firestore/lite';
import {useFirestore} from './use-firestore';
import {Event} from '../event/event';
import {v4} from 'uuid';

export const TestFirebaseButton = () => {
  const db = useFirestore();
  const fetchSampleDocument = async () => {
    // const sampleDocument = await getDoc(doc(db, 'events', 'sample-event'))
    // console.log(sampleDocument.data());

    const event: Event = {
      title: 'Konsultacje Consdathon',
      description: 'Zapraszamy!',
      inviteId: v4(),
      slots: [
        {
          id: v4(),
          date: '2022-05-28',
          timeFrom: '10:00',
          timeTo: '11:00'
        }
      ]
    };

    const ref = doc(db, 'events', v4());
    await setDoc(ref, event);

  }
  return <Button onClick={fetchSampleDocument}>
    Klikaj mocno
  </Button>;
}
