import Button from '@mui/material/Button/Button';
import {doc, getDoc} from 'firebase/firestore/lite';
import {useFirestore} from './use-firestore';

export const TestFirebaseButton = () => {
  const db = useFirestore();
  const fetchSampleDocument = async () => {
    const sampleDocument = await getDoc(doc(db, 'events', 'sample-event'))
    console.log(sampleDocument.data());
  }
  return <Button onClick={fetchSampleDocument}>
    Klikaj mocno
  </Button>;
}
