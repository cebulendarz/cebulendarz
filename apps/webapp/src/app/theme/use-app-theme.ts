import React from 'react';
import { AppThemeContext } from './app-theme.context';

export const useAppTheme = () => {
  const context = React.useContext(AppThemeContext);
  if (context === undefined) {
    throw new Error('useAppTheme must be used within a AppThemeContext');
  }
  return context;
};
