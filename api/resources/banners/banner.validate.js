const Joi = require('@hapi/joi')
const fileType = require('file-type')
const logger = require('../../../utils/logger')

const CONTENT_TYPES_PERMISSIONS = ['image/jpeg', 'image/png', 'image/jpg']

const validateImage = async (req,res,next) => {
    let contentType = req.get('content-type')

    if(!CONTENT_TYPES_PERMISSIONS.includes(contentType)) {
        logger.warn('Para guardar la imagen del banner necesita un content-type valido');
        res.status(400).send(`Archivos de ${contentType} no son soportados, usar archivos soportados como ${CONTENT_TYPES_PERMISSIONS}`)
        return 
    }

    let infoFile = await fileType.fromBuffer(req.body)
    if(!CONTENT_TYPES_PERMISSIONS.includes(infoFile.mime)) {
        let message = `Disparidad entre el content-type ${infoFile} y tipo de archivo ${infoFile.ext},
        no sera procesado tu solicitud`;
        logger.warn(`${message}`);
        res.status(400).send(mensaje)
        return 
    }

    req.extFile = infoFile.ext
    next();
}

module.exports = {
    validateImage
}