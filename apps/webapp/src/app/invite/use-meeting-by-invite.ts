import {useEffect, useState} from "react";
import {useFirestore} from "../firebase/use-firestore";
import {Meeting} from "../meeting/meeting";
import {collection, onSnapshot, query, where} from "firebase/firestore";

export function useMeetingByInvite(inviteId?: string) {
  const [meeting, setMeeting] = useState<Meeting>();
  const db = useFirestore();
  useEffect(
    () => {
      if (inviteId) {
        const unsubscribe = onSnapshot(
          query(collection(db, 'meetings'), where('inviteId', '==', inviteId)),
          docs => {
            if (docs.size !== 1) {
              throw new Error('Expected exactly one document for invite id = ' + inviteId);
            }
            setMeeting(docs.docs[0].data() as Meeting);
          });
        return () => unsubscribe();
      } else {
        return undefined;
      }
    },
    [inviteId]
  )
  return meeting;
}
