const winston = require('winston');

// Podemos decirle que logs pueden estar permitidos

/*
    Niveles de logs:
    error: 0
    warn: 1,
    info: 2,
    verbose: 3,
    debug: 4
    silly: 5
*/

// Incluir fecha a winston
const dateLog = winston.format((info) => {
    info.message = `${new Date().toISOString()} ${info.message}`
    return info
})

// Winston envia los logs por intermedio de transportes
module.exports = winston.createLogger({
    transports: [
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            // Formato para que winston no muestre
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            level: 'info',
            handleExceptions: true,
            format: winston.format.combine(
                dateLog(),
                winston.format.simple(),
            ),
            maxsize: 5120000, // 5 Mb
            maxFiles: 5,
            filename: `${__dirname}/../logs/aplication-log.log`
        })
    ]
})