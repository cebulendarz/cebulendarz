import { LoggerFactory, LogLevel } from '@consdata/logger-api';
import { ConsoleLogAppender } from '@consdata/logger-console';

LoggerFactory.addAppender(ConsoleLogAppender.instance);
LoggerFactory.setRootLogLevel(LogLevel.INFO);
