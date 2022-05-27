import {FC} from "react";
import {MeetingSlot} from "../meeting/meeting";

export type SlotChangedEvent = {
  slotId: string;
  date?: string;
  timeFrom?: string;
  timeTo?: string;
}

export type AddSlotsComponentProps = {
  slots: MeetingSlot[],
  slotChanged: (event: SlotChangedEvent) => void
  slotRemoved: (slotId: string) => void
}

export const AddSlotsComponent: FC<AddSlotsComponentProps> = (props) => {

  const handleDateChange = (slotId: string, value: string) => {
    props.slotChanged({slotId: slotId, date: value});
  }

  const handleTimeFromChange = (slotId: string, value: string) => {
    props.slotChanged({slotId: slotId, timeFrom: value});
  }

  const handleTimeToChange = (slotId: string, value: string) => {
    props.slotChanged({slotId: slotId, timeTo: value});
  }

  return (
    <>
      {props?.slots?.map(slot =>
        <div             key={slot.id}>
          <input
            value={slot.date ?? ""}
            onChange={(event) => {
              handleDateChange(slot.id, event.target.value)
            }}
          >
          </input>
          <input
            value={slot.timeFrom ?? ""}
            onChange={(event) => {
              handleTimeFromChange(slot.id, event.target.value)
            }}>
          </input>
          <input
            value={slot.timeTo ?? ""}
            onChange={(event) => {
              handleTimeToChange(slot.id, event.target.value)
            }}>
          </input>
          <button onClick={() => props.slotRemoved(slot.id)}>usuń</button>
        </div>)
      }
    </>
  );
}
