import {Layout} from "../ui-elements/layout";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {CircularProgress, TextField} from "@mui/material";
import {useFirestore} from "../firebase/use-firestore";
import {Meeting} from "../meeting/meeting";
import {onSnapshot, doc} from "firebase/firestore";

const LoadingScreen = () => <CircularProgress style={{marginTop: '32px'}}/>;

export const MeetingEdit = () => {
  const db = useFirestore();
  const {meetingId} = useParams<{ meetingId: string }>();
  const [meeting, setMeeting] = useState<Meeting>();

  useEffect(() => {
    if (meetingId) {
      const eventDoc = doc(db, 'meetings', meetingId);
      const unsubscribe = onSnapshot(eventDoc, (doc: any) => setMeeting({
        ...doc.data() as Meeting,
        id: meetingId
      }))
      return () => unsubscribe();
    } else {
      return undefined;
    }
  }, [meetingId]);

  return <Layout>
    {!meeting && <LoadingScreen/>}
    {meeting && <div>
      <div>
        <TextField label="Nazwa spotkania" variant="outlined" />
      </div>
      <div>
        <TextField label="Organizator" variant="outlined" />
      </div>
      <div>
        Sloty
      </div>
      <div>
        <div>link do zaproszeń</div>
      </div>
    </div>}
  </Layout>;

}
