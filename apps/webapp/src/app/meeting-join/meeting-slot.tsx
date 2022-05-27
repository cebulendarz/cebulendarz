import {Dialog, DialogActions, DialogContent, DialogTitle, TextField} from '@mui/material';
import {useState} from 'react';
import Button from '@mui/material/Button/Button';


interface MeetingSlotProps {
  inviteId?: string;
  date: string;
  timeFrom: string;
  timeTo: string;
  handleBooking: any;
  handleLock: any;
}

export const MeetingSlot = (slot: MeetingSlotProps) => {

  const [openDialog, setOpenDialog] = useState(false);
  const [name, setName] = useState("");

  const handleSlotClick = () => {
    setOpenDialog(true);
    slot.handleLock();
  }

  const handleClose = () => {
    setOpenDialog(false);
  }

  const handleAdd = () => {
    setOpenDialog(false);
    slot.handleBooking(name);
  }

  const handleChangeName = (event: any) => {
    setName((event.target as HTMLInputElement).value);
  }

  return (
    <>
      <div onClick={handleSlotClick} style={{
        background: '#66d24e',
        width: '120px',
        height: '60px',
        margin: '10px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderRadius: '20px',
        justifyContent: 'center',
        cursor: 'pointer'
      }}>
        <div>{slot.timeFrom} - {slot.timeTo}</div>
        <div>{slot.date}</div>
      </div>
      <Dialog open={openDialog} keepMounted onClose={handleAdd}>
        <DialogTitle>Zapisz się na {slot.date}, {slot.timeFrom} - {slot.timeTo}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Imie"
            variant="outlined"
            value={name}
            onChange={handleChangeName}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Anuluj</Button>
          <Button onClick={handleAdd}>Dodaj</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
