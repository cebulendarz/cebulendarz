export interface MeetingSlotBooking {
  email: string;
  name: string;
  // @deprecated - to be removed in near future
  userName?: string;
  signDate: string;
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
  // @deprecated - to be removed in near future
  organizerName?: string;
  organizer: MeetingOrganizer;
  modificationDates: MeetingModificationDates;
  title?: string;
  description?: string;
  slots: MeetingSlot[];
  bookings: { [key: string]: MeetingSlotBooking };
  // only as metadata for meeting join to leverage firestore rules restrictions (firestore rules cannot access changed object keys as list)
  updatedBooking?: {
    id: string;
  };
}
