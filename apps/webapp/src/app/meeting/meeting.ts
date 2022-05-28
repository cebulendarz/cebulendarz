export interface MeetingSlotLock {
  user: string; // uuid przeglądarki usera?
  expire: string; // data wygaśnięcia locka (np. założenie + 30min)
}

export interface MeetingSlotBooking {
  userName: string;
}

export interface MeetingSlot {
  id: string;
  date: string;
  timeFrom: string;
  timeTo: string;
}

export interface Meeting {
  id?: string;
  inviteId: string;
  organizerName?: string;
  title?: string;
  description?: string;
  slots: MeetingSlot[];
  locks: {[key: string]: MeetingSlotLock};
  bookings: {[key: string]: MeetingSlotBooking};
}
