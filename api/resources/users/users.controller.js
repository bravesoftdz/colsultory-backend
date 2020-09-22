const models = require('../../../models');

function createUser (user, hashedPassword) {
    return models.user.create({
        email: user.email,
        password: hashedPassword
    })
}

function userExist (email) {
    return new Promise((resolve, reject) => {
        // Comprobamos si el username o el email estan siendo usados 
        models.user.findOne({where: {email}})
        .then(users => {
            resolve(users)
        })
        .catch(err => {
            reject(err)
        })
    })
}

function getUser({
    email: email,
    id: id
}) {
    if(email) return models.user.findOne({ where: {email}});
    if(id) return models.user.findOne({ where: {id}});
    throw new Error('Error en la función de obtener un usuario sin especificar un email o un id');
}

// function getUsers() {
//     return Users.find({});
// }

module.exports = {
    createUser,
    userExist,
    getUser
    // getUsers
}