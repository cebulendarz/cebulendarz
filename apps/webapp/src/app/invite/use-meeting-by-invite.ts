import {useEffect, useState} from "react";
import {useFirestore} from "../firebase/use-firestore";
import {Meeting} from "../meeting/meeting";
import {collection, onSnapshot, query, where} from "firebase/firestore";

export function useMeetingByInvite(inviteId?: string): [Meeting|undefined, string|undefined] {
  const [meeting, setMeeting] = useState<Meeting>();
  const [error, setError] = useState<string>();
  const db = useFirestore();
  useEffect(
    () => {
      if (inviteId) {
        const unsubscribe = onSnapshot(
          query(collection(db, 'meetings'), where('inviteId', '==', inviteId)),
          docs => {
            if (docs.size !== 1) {
              setError(`Zaproszenie o identyfikatorze "${inviteId}" nie istnieje.`);
            } else {
              setMeeting(docs.docs[0].data() as Meeting);
            }
          });
        return () => unsubscribe();
      } else {
        return undefined;
      }
    },
    [inviteId]
  )
  return [meeting, error]
}
