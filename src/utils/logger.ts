import winston from "winston";
import env from "./env";
import fs from "fs";

const logLevel = env.NODE_ENV === "production" ? "error" : "debug";

const logFormat = winston.format.printf(
  ({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
  }
);

const logFilePath = 'combined.log'

if (fs.existsSync(logFilePath)) {
  fs.unlinkSync(logFilePath)
}
const logger = winston.createLogger({
  level: logLevel,
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    logFormat
  ),
  defaultMeta: { service: "user-service" },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: logFilePath }),
  ],
});

export default logger;
