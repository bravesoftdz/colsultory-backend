'use strict'

const Sequalize = require('sequelize')

module.exports = (sequalize, Datatypes) => {
    const banner = sequalize.define('banner', {
        image: Datatypes.STRING,
        title: Datatypes.STRING
    },
    {
        freezeTableName: true,
        timestamps: false,
        omitNull: true
    });

    return banner
}