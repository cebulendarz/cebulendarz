import * as ReactDOM from 'react-dom/client';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

import { LoggerFactory, LogLevel } from '@consdata/logger-api';
import { ConsoleLogAppender } from '@consdata/logger-console';

import { App } from './app/app';
import { environment } from './environments/environment';

LoggerFactory.addAppender(ConsoleLogAppender.instance);
LoggerFactory.setRootLogLevel(LogLevel.INFO);

if (environment.production) {
  Sentry.init({
    dsn: 'https://bcb0878b21304d39b9c314faa3db30ac@o1269720.ingest.sentry.io/6459957',
    integrations: [new BrowserTracing()],
    tracesSampleRate: 1.0,
  });
  LoggerFactory.getLogger('main.ts').info('Sentry initialized');
} else {
  LoggerFactory.getLogger('main.ts').info(
    'Sentry initialization skipped for non production env'
  );
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <App />
);
