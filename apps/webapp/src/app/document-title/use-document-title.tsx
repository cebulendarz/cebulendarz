import { useEffect } from 'react';

export const useDocumentTitle = (title?: string): void => {
  useEffect(() => {
    setTitleIfChanged(title ?? 'Cebulendarz');
  }, [title]);
};

const setTitleIfChanged = (title: string): void => {
  if (document.title !== title) {
    document.title = title;
  }
};
