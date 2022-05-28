import {FC} from "react";
import {MeetingSlot} from "../meeting/meeting";
import {TextField} from "@mui/material";
import Button from "@mui/material/Button/Button";
import {DesktopDatePicker} from '@mui/x-date-pickers/DesktopDatePicker';
import DeleteIcon from '@mui/icons-material/Delete';
import moment from "moment";

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

export const SlotsEditor: FC<AddSlotsComponentProps> = (props) => {

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
      {props?.slots?.map((slot, index) =>
        <div style={{marginTop: "10px", display: "flex"}} key={slot.id}>
          <DesktopDatePicker
            label="Data"
            minDate={moment()}
            mask="__-__-____"
            inputFormat="DD-MM-YYYY"
            value={slot.date ? moment(slot.date, "YYYY-MM-DD").toDate(): null}
            onChange={(value) => {
              if (value) {
                handleDateChange(slot.id, moment(value).format("YYYY-MM-DD"));
              } else {
                handleDateChange(slot.id, "");
              }
            }}
            renderInput={(params) =>
              <TextField
                style={{marginRight: "15px", width: "150px"}}
                variant={"standard"}
                {...params} />}
          />
          <TextField
            style={{marginRight: "15px", width: "150px"}}
            label="Od"
            value={slot.timeFrom ?? ""}
            onChange={(event) => {
              handleTimeFromChange(slot.id, event.target.value)
            }}
            variant="standard"
          />
          <TextField
            style={{marginRight: "15px", width: "150px"}}
            label="Do"
            value={slot.timeTo ?? ""}
            onChange={(event) => {
              handleTimeToChange(slot.id, event.target.value)
            }}
            variant="standard"
          />
          {index !== props.slots.length -1 &&
          <div style={{display: "flex", alignItems: "end"}}>
            <Button
              color="primary"
              onClick={() => props.slotRemoved(slot.id)}
              size="small"
              startIcon={<DeleteIcon/>}>
              Usuń
            </Button>
          </div>}
        </div>)
      }
    </>
  );
}
