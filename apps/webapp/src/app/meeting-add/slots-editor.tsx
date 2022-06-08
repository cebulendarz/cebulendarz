import { FC } from 'react';
import { Meeting, MeetingSlot } from '../meeting/meeting';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button/Button';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import DeleteIcon from '@mui/icons-material/Delete';
import styled from '@emotion/styled';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import { SlotsImport } from './slots-import';
import DayJsAdapter from '@date-io/dayjs';

const dayjs = new DayJsAdapter();

export type SlotChangedEvent = {
  slotId: string;
  date?: string;
  timeFrom?: string;
  timeTo?: string;
};

export type AddSlotsComponentProps = {
  meeting: Meeting;
  slots: MeetingSlot[];
  slotChanged: (event: SlotChangedEvent) => void;
  slotRemoved: (slotId: string) => void;
  slotImported: (slots: Partial<MeetingSlot>[]) => void;
};

const FlexFill = styled.div`
  flex: 1;
`;

export const SlotsEditor: FC<AddSlotsComponentProps> = (props) => {
  const handleDateChange = (slotId: string, value: string) => {
    props.slotChanged({ slotId: slotId, date: value });
  };

  const handleTimeFromChange = (slotId: string, value: string) => {
    props.slotChanged({ slotId: slotId, timeFrom: value });
  };

  const handleTimeToChange = (slotId: string, value: string) => {
    props.slotChanged({ slotId: slotId, timeTo: value });
  };

  return (
    <div>
      {props?.slots?.map((slot, index) => (
        <div style={{ marginTop: '10px', display: 'flex' }} key={slot.id}>
          <DesktopDatePicker
            label="Data"
            minDate={dayjs.date()}
            mask="__-__-____"
            inputFormat="DD-MM-YYYY"
            // value={slot.date ? dayjs.parse(slot.date, 'YYYY-MM-DD').toDate() : null} // TODO: co z tym?
            value={slot.date ? dayjs.parse(slot.date, 'YYYY-MM-DD') : null}
            onChange={(value) => {
              if (value) {
                handleDateChange(
                  slot.id,
                  dayjs.formatByString(value, 'YYYY-MM-DD')
                );
              } else {
                handleDateChange(slot.id, '');
              }
            }}
            renderInput={(params) => (
              <TextField
                style={{ marginRight: '15px', width: '150px' }}
                variant={'standard'}
                {...params}
              />
            )}
          />
          <TextField
            style={{ marginRight: '15px', width: '150px' }}
            label="Od"
            value={slot.timeFrom ?? ''}
            onChange={(event) => {
              handleTimeFromChange(slot.id, event.target.value);
            }}
            variant="standard"
          />
          <TextField
            style={{ marginRight: '15px', width: '150px' }}
            label="Do"
            value={slot.timeTo ?? ''}
            onChange={(event) => {
              handleTimeToChange(slot.id, event.target.value);
            }}
            variant="standard"
          />
          <FlexFill />
          {index !== props.slots.length - 1 && (
            <>
              {props.meeting.bookings[slot.id] && (
                <SlotBooked>
                  <Tooltip
                    title={`Zarezerwowany przez ${
                      props.meeting.bookings[slot.id].userName
                    }`}
                  >
                    <DoDisturbIcon />
                  </Tooltip>
                </SlotBooked>
              )}
              {!props.meeting.bookings[slot.id] && (
                <div style={{ display: 'flex', alignItems: 'end' }}>
                  <Button
                    color="primary"
                    onClick={() => props.slotRemoved(slot.id)}
                    size="small"
                    startIcon={<DeleteIcon />}
                  >
                    Usuń
                  </Button>
                </div>
              )}
            </>
          )}
          {index === props.slots.length - 1 && (
            <div style={{ display: 'flex', alignItems: 'end' }}>
              <SlotsImport onImport={props.slotImported} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const SlotBooked = styled.div`
  display: flex;
  align-items: center;
  color: lightgray;
`;
