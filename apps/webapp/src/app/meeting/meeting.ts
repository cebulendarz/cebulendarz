export interface MeetingSlotLock {
  user: string; // uuid przeglądarki usera?
  expire: Date; // data wygaśnięcia locka (np. założenie + 30min)
}

export interface MeetingSlotBooking {
  userName: string;
}

export interface MeetingSlot {
  id: string;
  date: string;
  timeFrom?: string;
  timeTo?: string;
  lock?: MeetingSlotLock;
  booking?: MeetingSlotBooking;
}

export interface Meeting {
  id?: string;
  inviteId: string;
  title?: string;
  description?: string;
  slots: MeetingSlot[]
}
