const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, 'User need a username']
    },
    name: {
        type: String,
        required: [true, 'User need a name']
    },
    email: {
        type: String,
        required: [true, 'User need a email']
    },
    password: {
        type: String,
        required: [true, 'User need a password']
    }
})

module.exports = mongoose.model('users', userSchema);