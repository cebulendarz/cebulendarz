import * as ReactDOM from 'react-dom/client';

import './logging';
import { App } from './app/app';
import { AppProviders } from './app/app.providers';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <AppProviders>
    <App />
  </AppProviders>
);
