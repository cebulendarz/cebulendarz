export interface MeetingSlotBooking {
  userName: string;
}

export interface MeetingSlot {
  id: string;
  date: string;
  timeFrom: string;
  timeTo: string;
}

export interface MeetingOrganizer {
  email: string;
  name: string;
}

export interface MeetingModificationDates {
  created: string;
  updated: string;
}

export interface Meeting {
  id?: string;
  inviteId: string;
  organizerName?: string;
  // @deprecated - to be removed in near future
  organizer: MeetingOrganizer;
  modificationDates: MeetingModificationDates;
  title?: string;
  description?: string;
  slots: MeetingSlot[];
  bookings: { [key: string]: MeetingSlotBooking };
}
