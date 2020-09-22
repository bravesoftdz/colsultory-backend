'use strict'

const Sequalize = require('sequelize')

module.exports = (sequalize, Datatypes) => {
    const client = sequalize.define('client', {
        image: Datatypes.STRING,
        title: Datatypes.STRING
    },
    {
        freezeTableName: true,
        timestamps: false,
        omitNull: true
    });

    return client
}
