var winston = require('winston');

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({ json: false, timestamp: true }),
    new winston.transports.File({ filename: './debug.log', json: false })
  ],
  exceptionHandlers: [
    new (winston.transports.Console)({ json: false, timestamp: true }),
    new winston.transports.File({ filename:  './exceptions.log', json: false })
  ],
  exitOnError: false
});

module.exports = logger;

/*
{
  "id": "d91a367a-1c22-4cac-8840-599450b92865",
  "name": "Program",
  "isOverridable": true,
  "entries": [
    {
      "value": "channel",
      "synonyms": [
        "HBO",
        "AXN",
        "STAR",
        "channel"
      ]
    },
    {
      "value": "Shows",
      "synonyms": [
        "Shows"
      ]
    },
    {
      "value": "programname",
      "synonyms": [
        "programname"
      ]
    }
  ],
  "isEnum": false,
  "automatedExpansion": false
}

*/
