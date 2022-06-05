import React from 'react';
import { AuthenticationContext } from './authencation.context';

export const useAuthentication = () => {
  const context = React.useContext(AuthenticationContext);
  if (context === undefined) {
    throw new Error(
      'useAuthentication must be used within a AuthenticationContext'
    );
  }
  return context;
};
