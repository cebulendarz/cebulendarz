import {Layout} from "../ui-elements/layout";
import {useParams} from "react-router-dom";

export const EventAdd = () => {
  const {eventId} = useParams<{eventId: string}>();
  return <Layout>
    <div>Dodaj: {eventId}</div>
  </Layout>;
}
