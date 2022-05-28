import {useNavigate} from "react-router-dom";
import {Layout} from "../ui-elements/layout";
import {CircularProgress} from "@mui/material";
import {useEffect} from "react";
import {v4} from "uuid";
import {useFirestore} from "../firebase/use-firestore";
import {doc, setDoc} from "firebase/firestore";
import {Meeting} from '../meeting/meeting';
import {userSession} from "../session/user-session";

export const MeetingAdd = () => {
  const navigate = useNavigate();
  const db = useFirestore();
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
      organizerName: userSession.getUserName() ?? ''
    };
    setDoc(meetingDoc, meeting)
      .then(() => {
        console.log(`Stworzono wydarzenie: ${meetingDoc.id}`)
        navigate(`/meeting/edit/${meetingDoc.id}`);
      })
      .catch(error => {
        console.error(error);
        alert('Błąd tworzenia wydarzenia');
      })
  }, [db, navigate]);
  return <Layout>
    <CircularProgress style={{marginTop: '32px'}}/>
  </Layout>;
}
