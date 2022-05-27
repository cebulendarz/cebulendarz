export interface EventSlotLock {
  user: string; // uuid przeglądarki usera?
  expire: Date; // data wygaśnięcia locka (np. założenie + 30min)
}

export interface EventSlotBooking {
  userName: string;
}

export interface EventSlot {
  id: string;
  date: string;
  timeFrom?: string;
  timeTo?: string;
  lock?: EventSlotLock;
  booking?: EventSlotBooking;
}

export interface Event {
  id?: string;
  inviteId: string;
  title: string;
  description?: string;
  slots: EventSlot[]
}
