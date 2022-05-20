import Button from '@mui/material/Button/Button';
import {useFirebase} from './use-firebase';

export const TestFirebaseButton = () => {
  const firebase = useFirebase();
  const fetchSampleDocument = async () => {
    const doc = await firebase.firestore()
      .collection('events')
      .doc('sample-event')
      .get();
    console.log(doc.data());
  }
  return <Button onClick={fetchSampleDocument}>
    Klikaj mocno
  </Button>;
}
