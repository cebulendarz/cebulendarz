import { createEvent, DateArray } from 'ics';
import { useEffect, useState } from 'react';
import { useQRCode } from 'next-qrcode';
import dayjs from 'dayjs';

export const Ical = (props: {
  title: string;
  description: string;
  date: string;
  timeFrom: string;
  timeTo: string;
}) => {
  const [ical, setIcal] = useState<string>('');
  const [raw, setRaw] = useState<string>('');

  useEffect(() => {
    try {
      const start = dateArray(props.date, props.timeFrom);
      const end = dateArray(props.date, props.timeTo);

      const { error, value: ical } = createEvent({
        title: props.title,
        description: props.description,
        start: start,
        end: end,
      });
      if (error) {
        console.error(`Error while generating ical`, error);
      } else if (ical) {
        setIcal(ical);
        setRaw(
          URL.createObjectURL(
            new Blob([ical], {
              type: 'text/calendar',
            })
          )
        );
      } else {
        console.error(`Empty ical returned from event`);
      }
    } catch (e) {
      console.error(`Error while generating ical`, e);
    }
  }, [props]);

  const { Canvas } = useQRCode();

  return (
    <div>
      <a href={raw}>
        {ical && (
          <Canvas
            text={ical}
            options={{
              type: 'image/jpeg',
              quality: 0.3,
              margin: 4,
              scale: 4,
              width: 300,
            }}
          />
        )}
      </a>
    </div>
  );
};

function dateArray(
  date: string,
  time: Date | string | number | (number | string)[]
): DateArray {
  const result = dayjs(date + 'T' + time)
    .toArray()
    .splice(0, 5);
  result[1]++;
  return result as unknown as DateArray;
}
