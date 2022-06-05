import { useEffect } from 'react';

export const useDocumentTitle = (title?: string): void => {
  useEffect(() => {
    const previous = setTitleIfChanged(title || 'Cebulendarz');
    return () => {
      if (previous) {
        setTitleIfChanged(previous);
      }
    };
  }, [title]);
};

const setTitleIfChanged = (title: string): string | undefined => {
  if (document.title !== title) {
    const previous = document.title;
    document.title = title;
    return previous;
  } else {
    return undefined;
  }
};
