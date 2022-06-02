import moment from 'moment';
import {createEvent, DateArray} from 'ics';
import {useEffect, useState} from 'react';
import {useQRCode} from 'next-qrcode';
import {LoggerFactory} from '@consdata/logger-api';

const log = LoggerFactory.getLogger('Ical');

export const Ical = (props: {
  title: string,
  description: string,
  date: string,
  timeFrom: string,
  timeTo: string
}) => {
  const [ical, setIcal] = useState<string>('');
  const [raw, setRaw] = useState<string>('');

  function dateArray(date: string, timeFrom: moment.Moment | Date | string | number | (number | string)[] | moment.MomentInputObject = props.timeFrom) {
    const dateTime = moment(date + 'T' + timeFrom).toArray().splice(0, 5);
    dateTime[1]++;
    return dateTime as unknown as DateArray;
  }

  useEffect(() => {
    try {
      const start = dateArray(props.date, props.timeFrom);
      const end = dateArray(props.date, props.timeTo);

      const {error, value: ical} = createEvent({
        title: props.title,
        description: props.description,
        start: start,
        end: end,
      }) as any;
      if (error) {
        log.error(error);
      } else {
        setIcal(ical);
        setRaw(URL.createObjectURL(new Blob([ical], {
          type: "text/calendar"
        })));
      }
    } catch (e) {
      log.error(`Error while generating ical`, e);
    }
  }, [props]);

  const {Canvas} = useQRCode();

  return <div>
    <a href={raw}>
      {ical && <Canvas
        text={ical}
        options={{
          type: 'image/jpeg',
          quality: 0.3,
          level: 'M',
          margin: 4,
          scale: 4,
          width: 300,
        }}
      />}
    </a>
  </div>

}
