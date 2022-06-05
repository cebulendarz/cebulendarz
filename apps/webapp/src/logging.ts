import { LoggerFactory } from '@consdata/logger-api';
import { ConsoleLogAppender } from '@consdata/logger-console';
import { environment } from './environments/environment';

LoggerFactory.addAppender(ConsoleLogAppender.instance);
LoggerFactory.setRootLogLevel(environment.logger.logLevel);
