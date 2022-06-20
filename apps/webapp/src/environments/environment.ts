// This file can be replaced during build by using the `fileReplacements` array.
// When building for production, this file is replaced with `environment.prod.ts`.

import { LogLevel } from '@consdata/logger-api';

export const environment = {
  production: false,
  logger: {
    logLevel: LogLevel.DEBUG,
  },
};
