// noinspection JSUnusedGlobalSymbols - used by build to swap definition based on target environment

import { LogLevel } from '@consdata/logger-api';

export const environment = {
  production: true,
  logger: {
    logLevel: LogLevel.OFF,
  },
};
