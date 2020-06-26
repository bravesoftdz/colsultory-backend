const Users = require('./users.model')

function createUser (user, hashedPassword) {
    return new Users({
        ...user,
        password: hashedPassword
    }).save();
}

function userExist (username, email) {
    return new Promise((resolve, reject) => {
        // Comprobamos si el username o el email estan siendo usados 
        Users.find().or([{'username': username}, {'email': email}])
        .then(users => {
            resolve(users.length > 0)
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
    if(email) return Users.findOne({ email: email});
    if(id) return Users.findById(id);
    throw new Error('Error en la función de obtener un usuario sin especificar un email o un id');
}

function getUsers() {
    return Users.find({});
}

module.exports = {
    createUser,
    userExist,
    getUser,
    getUsers
}