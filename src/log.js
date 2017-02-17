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
[{"value":"1700 CTI News","synonyms":["1700 CTI News"]},{"value":" 1st Time She Came","synonyms":["1st Time She Came"]},{"value":" 2017 CFP National Championship","synonyms":["2017 CFP National Championship"]},{"value":" 21st Century","synonyms":["21st Century"]},{"value":" 300 Rise of an Empire","synonyms":["300 Rise of an Empire"]},{"value":" 40 Days and 40 Nights","synonyms":["40 Days and 40 Nights"]},{"value":" 80 cm","synonyms":["80 cm"]},{"value":" A Bridge Too Far","synonyms":["A Bridge Too Far"]},{"value":" A Craftsman's Legacy","synonyms":["A Craftsman's Legacy"]},{"value":" A Different World","synonyms":["A Different World"]},{"value":" A Dormir con�","synonyms":["A Dormir con..."]},{"value":" A Dream Home Planning","synonyms":["A Dream Home Planning"]}]

Prod Programs Entity ID : b6227dd3-9fdc-4ff9-8ae7-3ac857a91f22
Developer access token - 175a0c33cc1d49a199e44608fae661e4
Client access token - ba4202d56cf34d9c9b1dfb12162efc7f


{"value": "1700 CTI News","synonyms": ["1700 CTI News"]},{"value": "
1st Time She Came","synonyms": ["1st Time She Came"]},{"value": "
2017 CFP National Championship","synonyms": ["2017 CFP National Championship"]},{"value": "
21st Century","synonyms": ["21st Century"]},{"value": "
300 Rise of an Empire","synonyms": ["300 Rise of an Empire"]},{"value": "
40 Days and 40 Nights","synonyms": ["40 Days and 40 Nights"]},{"value": "
80 cm","synonyms": ["80 cm"]},{"value": "
A Bridge Too Far","synonyms": ["A Bridge Too Far"]},{"value": "
A Craftsman's Legacy","synonyms": ["A Craftsman's Legacy"]},{"value": "
A Different World","synonyms": ["A Different World"]},{"value": "
A Dormir con?","synonyms": ["A Dormir con..."]},{"value": "
A Dream Home Planning","synonyms": ["A Dream Home Planning"]}

*/
