const express = require('express');
const logger = require('../../../utils/logger')
const { v4: uuidv4 } = require('uuid')
const bannerController = require('./banner.controller')
const { validateImage } = require('./banner.validate.js');
const bannersRouter = express.Router();
const passport = require('passport')

// Autenticación
const jwtAuthenticate = passport.authenticate('jwt', { session: false });

// Obtener banners
bannersRouter.get('/', (req, res) => {
    return bannerController.getBanners()
    .then(banners => {
        res.status(200).json(banners)
    })
    .catch(err => {
        res.status(500).json(err)
    })
})

// Crear Banner
bannersRouter.post('/', jwtAuthenticate, (req,res) => {
    console.log(req.file)
    let newBanner = req.body
    return bannerController.createBanner(newBanner,req.user.id)
    .then(banner => {
        logger.info('Banner creado correctamente')
        res.status(201).json(banner)
    })
    .catch(err => {
        console.log(err)
        logger.error('No se pudo crear el banner', err)
        res.status(500).json(err)
    })
})

// Editar imagen 
bannersRouter.put('/:id', jwtAuthenticate, (req, res) => {
    let updateBanner = req.body
    let id = req.params.id
    return bannerController.editBanner(id, updateBanner)
    .then(banner => {
        logger.info('El banner se ha actualizado correctamente')
        res.json(banner)
    })
    .catch(err => {
        logger.info('No se logro editar el banner')
        res.status(500).json('Error al editar el banner', err)
    })
})

// Obtener un producto por su id 
bannersRouter.get('/:id', (req, res) => {
    let id = req.params.id
    return bannerController.getBanner(id)
    .then(banner => {
        res.json(banner)
    })
    .catch(err => {
        logger.info('No se logro mostrar el banner')
        res.status(500).json('El id del banner no existe', err)
    })
})

// Eliminar un producto
bannersRouter.delete('/:id', jwtAuthenticate, (req, res) => {
    let id = req.params.id
    return bannerController.deleteBanner(id)
    .then(result => {
        logger.info('El banner fue eliminado')
        res.status(200).json('Se elimino correctamente el banner')
    })
    .catch(err => {
        logger.info('No se logro eliminar el banner')
        res.status(500).json('No se puede eliminar el banner', err)
    })
})

module.exports = bannersRouter