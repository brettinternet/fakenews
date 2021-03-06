// WINSTON LOGGER
const winston = require('winston'),
      fs = require('fs');
const logDir = 'server/log';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}
const tsFormat = () => (new Date()).toLocaleTimeString();
function logFormat(options) {
  return options.timestamp() +' '+ options.level.toUpperCase() +' '+ (options.message ? options.message : '') +
  (options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' );
}
// levels: { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }
const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      timestamp: tsFormat,
      colorize: true,
      level: 'warn'
    }),
    new (winston.transports.File)({
      filename: `${logDir}/results.log`,
      timestamp: tsFormat,
      level: 'info',
    })
  ]
});
const logger2 = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      timestamp: tsFormat,
      colorize: true,
      level: 'warn'
    }),
    new (winston.transports.File)({
      filename: `${logDir}/results2.log`,
      timestamp: tsFormat,
      level: 'info',
    })
  ]
});
const dbErrors = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      timestamp: tsFormat,
      colorize: true,
      level: 'warn'
    }),
    new (winston.transports.File)({
      filename: `${logDir}/database.log`,
      timestamp: tsFormat,
      level: 'info',
      json: false,
      formatter: logFormat
    })
  ]
});
const getErrors = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      timestamp: tsFormat,
      colorize: true,
      level: 'warn'
    }),
    new (winston.transports.File)({
      filename: `${logDir}/requests.log`,
      timestamp: tsFormat,
      level: 'info',
      json: false,
      formatter: logFormat
    })
  ]
});
const processErrors = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      timestamp: tsFormat,
      colorize: true,
      level: 'warn'
    }),
    new (winston.transports.File)({
      filename: `${logDir}/processing.log`,
      timestamp: tsFormat,
      level: 'info',
      json: false,
      formatter: logFormat
    })
  ]
});

module.exports = {
  log: logger,
  log2: logger2,
  error: dbErrors,
  get: getErrors,
  process: processErrors
}
