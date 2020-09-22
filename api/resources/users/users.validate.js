const Joi = require('@hapi/joi');
const logger = require('../../../utils/logger');

const validateUser = Joi.object({
    email: Joi.string()
    .email()
    .required(),
    password: Joi.string()
    .alphanum()
    .max(45)
    .min(8)
    .required()
})

module.exports = (req,res,next) => {
    let result = validateUser.validate(req.body, {abortEarly: false, convert: false})

    // Si no existe un error en la validación
    if(result.error === undefined) {
        next();
    } else {
        logger.info('Usuario falló en la validación', result.error);
        res.status(400).send('Información del usuario no cumple con los requisitos. ')
    }
}