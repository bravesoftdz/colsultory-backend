'use strict'

const Sequalize = require('sequelize')

module.exports = (sequalize, Datatypes) => {
    const admin = sequalize.define('user', {
        email: Datatypes.STRING,
        password: Datatypes.STRING
    },
    {
        freezeTableName: true,
        timestamps: false,
        omitNull: true
    });

    return admin
}
