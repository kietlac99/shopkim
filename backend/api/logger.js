/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
import winston from "winston";

const level = process.env.LOG_LEVEL || "debug";

const myFormat = winston.format.printf(
  ({ level, message, timestamp }) => `${timestamp} ${level}: ${message}`
);

const logger = winston.createLogger({
  format: winston.format.combine(winston.format.timestamp(), myFormat),
  transports: [
    new winston.transports.File({
      filename: "logs/combined.log",
    }),
    new winston.transports.File({
      filename: "logs/errors.log",
      level: "error",
    }),
    new winston.transports.File({
      filename: "logs/info.log",
      level: "info",
    }),
    new winston.transports.File({
      filename: "logs/debug.log",
      level: "debug",
    }),
  ],
});

if (process.env.NODE_ENV === "DEVELOPMENT") {
  logger.add(
    new winston.transports.Console({
      level,
      timestamp() {
        return new Date().toISOString();
      },
      format: winston.format.simple(),
    })
  );
}

export function logX(...params) {
  if (process.env.NODE_ENV === "DEVELOPMENT") {
    console.log(...params);
  }
}

export default logger;
