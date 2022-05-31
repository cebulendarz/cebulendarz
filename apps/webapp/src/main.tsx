import * as ReactDOM from 'react-dom/client';
import * as Sentry from "@sentry/react";
import {BrowserTracing} from "@sentry/tracing";

import {App} from './app/app';
import {environment} from './environments/environment';

if (environment.production) {
  Sentry.init({
    dsn: "https://bcb0878b21304d39b9c314faa3db30ac@o1269720.ingest.sentry.io/6459957",
    integrations: [new BrowserTracing()],
    tracesSampleRate: 1.0,
  });
}

ReactDOM
  .createRoot(document.getElementById('root') as HTMLElement)
  .render(<App/>);
