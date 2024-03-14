import * as winston from 'winston';
import * as daily from 'winston-daily-rotate-file';
import { utilities } from 'nest-winston/dist/winston.utilities';

const { combine, timestamp, printf } = winston.format;

//https://github.com/winstonjs/winston
export const logger = {
  transports: [
    new daily({
      level: 'info',
      dirname: `${process.cwd()}/logs/info`,
      maxFiles: 7,
      maxSize: '20m',
      datePattern: 'YYYY-MM-DD',
      filename: 'admin-%DATE%.info',
      extension: '.log',
      zippedArchive: true,
      format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        printf((info) => {
          return `[ADMIN ${process.env.ENV}] - ${info.timestamp} [${info.level}] ${info.message}`;
        }),
      ),
    }),
    new daily({
      level: 'error',
      dirname: `${process.cwd()}/logs/error`,
      maxFiles: 7,
      maxSize: '20m',
      datePattern: 'YYYY-MM-DD',
      filename: 'admin-%DATE%.error',
      extension: '.log',
      zippedArchive: true,
      format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        printf((info) => {
          return `[ADMIN ${process.env.ENV}] - ${info.timestamp} [${info.level}] ${info.message}`;
        }),
      ),
    }),
    new winston.transports.Console({
      level: 'info',
      format: combine(
        timestamp(),
        utilities.format.nestLike(`ADMIN ${process.env.ENV}`, {
          prettyPrint: true,
        }),
      ),
    }),
  ],
};
