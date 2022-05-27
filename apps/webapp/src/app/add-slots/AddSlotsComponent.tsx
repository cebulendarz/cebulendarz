import {FC} from "react";
import {MeetingSlot} from "../meeting/meeting";
import {TextField} from "@mui/material";
import Button from "@mui/material/Button/Button";
import DeleteIcon from '@mui/icons-material/Delete';

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
        <div style={{marginTop: "10px", display: "flex"}} key={slot.id}>
          <TextField
            style={{marginRight: "20px", width: "150px"}}
            label="Data"
            value={slot.date ?? ""}
            onChange={(event) => {
              handleDateChange(slot.id, event.target.value)
            }}
            variant="standard"
          />
          <TextField
            style={{marginRight: "10px", width: "150px"}}
            label="Od"
            value={slot.timeFrom ?? ""}
            onChange={(event) => {
              handleTimeFromChange(slot.id, event.target.value)
            }}
            variant="standard"
          />
          <TextField
            style={{marginRight: "10px", width: "150px"}}
            label="Do"
            value={slot.timeTo ?? ""}
            onChange={(event) => {
              handleTimeToChange(slot.id, event.target.value)
            }}
            variant="standard"
          />
          <div style={{display: "flex", alignItems: "end"}}>
            <Button
              color="primary"
              onClick={() => props.slotRemoved(slot.id)}
              size="small"
              startIcon={<DeleteIcon/>}>
              Usuń
            </Button>
          </div>
        </div>)
      }
    </>
  );
}
