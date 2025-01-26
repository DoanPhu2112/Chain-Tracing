import winston from 'winston'

const logger = winston.createLogger({
    transports: [
       new winston.transports.Console(),
       new winston.transports.File({filename: 'combined.log'})
    ],
    format: winston.format.combine(
        winston.format.label({label: 'backend'}),
        winston.format.timestamp(),
        winston.format.json(),
        winston.format.prettyPrint(),
    )
})
export default logger;