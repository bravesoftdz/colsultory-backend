// *Este archivo vamos a ser un middleware de verificación de token 
const passportJWT = require('passport-jwt')
const logger = require('../../utils/logger')
const usersController = require('../resources/users/users.controller')

// *Opciones de verificación dandole nuestra llave secreta y la ruta de la cabecera para que lo verifique
let jwtOptions = {
    secretOrKey: 'CONSULTORY',
    jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken()
}

module.exports = new passportJWT.Strategy(jwtOptions, (jwtPayload, next) => {
    console.log(jwtPayload)
    usersController.getUser({id: jwtPayload.id})
    .then(user => {
        if(!user) {
            logger.info(`No se encontro a nadie con el id ${jwtPayload.id}`)
            next(null, false)
            return
        }

        logger.info(`Token valido se encontro al usuario ${user.email} autenticación completada`)
        next(null, {
            username: user.email,
            id: user.id
        })
    })
    .catch(err => {
        logger.info("Error ocurrido al validar el token")
        next(err);
    })
})