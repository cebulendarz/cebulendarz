import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

const LazySplash = lazy(() =>
  import('./splash/splash').then((module) => ({
    default: module.Splash,
  })),
);

const LazyMeetingAdd = lazy(() =>
  import('./meeting-add/meeting-add').then((module) => ({
    default: module.MeetingAdd,
  })),
);

const LazyMeetingEdit = lazy(() =>
  import('./meeting-add/meeting-edit').then((module) => ({
    default: module.MeetingEdit,
  })),
);

const LazyMeetingJoin = lazy(() =>
  import('./meeting-join/meeting-join').then((module) => ({
    default: module.MeetingJoin,
  })),
);

const LazyBooking = lazy(() =>
  import('./booking/booking').then((module) => ({
    default: module.Booking,
  })),
);

export const AppRouting = () => (
  <Suspense fallback={null}>
    <Routes>
      <Route path="/" element={<LazySplash />} />
      <Route path="meeting/add" element={<LazyMeetingAdd />} />
      <Route path="meeting/edit/:meetingId" element={<LazyMeetingEdit />} />
      <Route path="meeting/join/:inviteId" element={<LazyMeetingJoin />} />
      <Route
        path="meeting/:inviteId/booking/:slotId"
        element={<LazyBooking />}
      />
    </Routes>
  </Suspense>
);
