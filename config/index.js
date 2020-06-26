const ambient = process.env.NODE_ENV || 'development'

const configBase = {
    jwt: {},
    port: process.env.PORT
}

let configAmbient = {}

switch (ambient) {
    case 'development':
        configAmbient = require('./development');
        break;
    case 'production':
        configAmbient = require('./production');
        break;
    default:
        configAmbient = require('./development');
}

module.exports = {
    ... configBase,
    ... configAmbient
}