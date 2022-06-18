import React from 'react';
import { AppThemeModeContext } from './app-theme-mode.context';

export const useAppThemeMode = () => {
  const context = React.useContext(AppThemeModeContext);
  if (context === undefined) {
    throw new Error(
      'useAppThemeMode must be used within a AppThemeModeContext'
    );
  }
  return context;
};
