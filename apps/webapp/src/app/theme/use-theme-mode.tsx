import { useMemo, useState } from 'react';

export const useThemeMode = (): [
  'dark' | 'light' | undefined,
  { change: () => void }
] => {
  const [mode, setMode] = useState<'dark' | 'light'>();
  const themeMode = useMemo(
    () => ({
      change: () => {
        const currentTheme =
          localStorage.getItem('theme') === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', currentTheme);
        setMode(currentTheme);
      },
    }),
    []
  );

  return [mode, themeMode];
};
