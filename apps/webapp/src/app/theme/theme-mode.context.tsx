import { createContext, FC, ReactNode } from 'react';

export const ThemeModeContext = createContext({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  themeModeChange: () => {},
  mode: 'light',
});

interface ThemeModeProviderProps {
  children: ReactNode;
  themeModeChange: () => void;
  mode: 'dark' | 'light';
}

export const ThemeModeProvider: FC<ThemeModeProviderProps> = ({
  children,
  themeModeChange,
  mode,
}: ThemeModeProviderProps) => {
  return (
    <ThemeModeContext.Provider
      value={{ mode, themeModeChange: themeModeChange }}
    >
      {children}
    </ThemeModeContext.Provider>
  );
};
