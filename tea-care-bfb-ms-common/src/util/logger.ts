import { createLogger, format, transports } from 'winston';
const { combine, timestamp, label, printf, errors, colorize } = format;
import stream from 'stream';
import { json } from 'express';
const path = require('path');

let alignColorsAndTime;

if (process.env.NODE_ENV === 'local') {
  alignColorsAndTime = format.combine(
    format.colorize({
      all: true,
    }),
    format.timestamp({
      format: 'YY-MM-DD HH:mm:ss',
    }),
    errors({ stack: true }),
    format.printf((info) => `${info.timestamp} : ${info.message}`)
  );
} else {
  alignColorsAndTime = format.combine(
    format.timestamp({
      format: 'YY-MM-DD HH:mm:ss',
    }),
    errors({ stack: true }),
    format.printf((info) => `${info.message}`)
  );
}

export const logger = createLogger({
  format: alignColorsAndTime,
  transports: [
    //Define como serão as mensagens de log no ARQUIVO de log
    new transports.File({
      filename: './app-logs/log.log',
      level: process.env.LOGGER_LEVEL,
      handleExceptions: true,
      maxsize: 5242880, //5MB
      maxFiles: 5,
    }),

    //Define como serão as mensagens de log no CONSOLE
    new transports.Console({
      level: process.env.LOGGER_LEVEL,
      handleExceptions: true,
    }),
  ],

  exitOnError: false,
});

export const loggerWrite = {
  write: function (message: string) {
    console.log(message);
  },
};

logger.stream = (options?: any) => new stream.Duplex(loggerWrite);
