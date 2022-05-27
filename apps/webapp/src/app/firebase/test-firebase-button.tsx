import Button from '@mui/material/Button/Button';
import {doc, setDoc} from 'firebase/firestore';
import {useFirestore} from './use-firestore';
import {v4} from 'uuid';
import {Meeting} from "../meeting/meeting";

export const TestFirebaseButton = () => {
  const db = useFirestore();
  const fetchSampleDocument = async () => {
    // const sampleDocument = await getDoc(doc(db, 'meetings', 'sample-meeting'))
    // console.log(sampleDocument.data());

    const meeting: Meeting = {
      title: 'Konsultacje Consdathon',
      description: 'Zapraszamy!',
      inviteId: v4(),
      slots: [
        {
          id: v4(),
          date: '2022-05-28',
          timeFrom: '10:00',
          timeTo: '11:00',
          booking: {
            userName: 'Grzegorz'
          }
        }
      ]
    };

    const ref = doc(db, 'meetings', v4());
    await setDoc(ref, meeting);
  }
  return <Button onClick={fetchSampleDocument}>
    Klikaj mocno
  </Button>;
}
