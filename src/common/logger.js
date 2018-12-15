import winston from 'winston'

const {LOG_LEVEL = 'verbose'} = process.env

const logger = winston.createLogger({
  level: LOG_LEVEL,
  prettyPrint: true,
  colorize: true,
  silent: false,
  timestamp: false,
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
})

export default logger
