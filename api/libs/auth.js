// *Este archivo vamos a ser un middleware de verificación de token 
const passportJWT = require('passport-jwt')
const logger = require('../../utils/logger')
const usersController = require('../resources/users/users.controller')
const config = require('../../config')

// *Opciones de verificación dandole nuestra llave secreta y la ruta de la cabecera para que lo verifique
let jwtOptions = {
    secretOrKey: config.jwt.SECRET,
    jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken()
}

// Middleware de Pasaporte del JWT para verificar si el token es valido
module.exports = new passportJWT.Strategy(jwtOptions, (jwtPayload, next) => {
    // *Verificamos si el usuario que pasa con el token existe
    console.log(jwtPayload)
    usersController.getUser({id: jwtPayload.id})
    .then(user => {
        if(!user) {
            logger.info(`No se encontro a nadie con el id ${jwtPayload.id}`)
            // *fallo la validacion del token
            next(null, false)
            return
        }

        logger.info(`Token valido se encontro al usuario ${user.username} autenticación completada`)
        next(null, {
            username: user.username,
            id: user.id
        })
    })
    .catch(err => {
        logger("Error ocurrido al validar el token")
        next(err);
    })
})