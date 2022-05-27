import moment from 'moment';
import {createEvent, DateArray} from 'ics';
import {useEffect, useState} from 'react';

export const Ical = (props: {
  title: string,
  description: string,
  date: string,
  timeFrom: string,
  timeTo: string
}) => {
  const [ical, setIcal] = useState<string>();

  useEffect(() => {
    try {
      const start = moment(props.date + 'T' + props.timeFrom).toArray().splice(0, 5) as unknown as DateArray;
      const end = moment(props.date + 'T' + props.timeTo).toArray().splice(0, 5) as unknown as DateArray;

      const {error, value: ical} = createEvent({
        title: props.title,
        description: props.description,
        start: start,
        end: end,
      }) as any;
      if (error) {
        console.log(error);
      } else {
        setIcal(ical);
      }
    } catch (e) {
      console.log(e);
    }
  }, [props]);

  return <div>
    <pre>{ical}</pre>
  </div>

}
