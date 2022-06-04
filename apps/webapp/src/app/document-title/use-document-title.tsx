import {Meeting} from '../meeting/meeting';
import {useEffect, useState} from 'react';

export const useDocumentTitle = (meeting: Meeting | undefined): string => {
  const [meetingTitle, setMeetingTitle] = useState<string>();
  useEffect(() => {
    setMeetingTitle(meeting?.title);
  }, [meeting?.title]);
  return meetingTitle || 'Cebulendarz';
}
