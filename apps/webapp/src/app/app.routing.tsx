import { Route, Routes } from 'react-router-dom';
import { Splash } from './splash/splash';
import { MeetingAdd } from './meeting-add/meeting-add';
import { MeetingEdit } from './meeting-add/meeting-edit';
import { MeetingJoin } from './meeting-join/meeting-join';
import { Booking } from './booking/booking';

export const AppRouting = () => (
  <Routes>
    <Route path="/" element={<Splash />} />
    <Route path="meeting/add" element={<MeetingAdd />} />
    <Route path="meeting/edit/:meetingId" element={<MeetingEdit />} />
    <Route path="meeting/join/:inviteId" element={<MeetingJoin />} />
    <Route path="meeting/:inviteId/booking/:slotId" element={<Booking />} />
  </Routes>
);
