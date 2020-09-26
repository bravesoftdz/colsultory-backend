const express = require('express');
const logger = require('../../../utils/logger')
const { v4: uuidv4 } = require('uuid')
const clientController = require('./client.controller')
const { validateImage } = require('./client.validate.js');
const clientsRouter = express.Router();
const passport = require('passport')

// Autenticación
const jwtAuthenticate = passport.authenticate('jwt', { session: false });

// Obtener clientes
clientsRouter.get('/', (req, res) => {
    return clientController.getClients()
    .then(clients => {
        res.status(200).json(clients)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
})

// Crear cliente
clientsRouter.post('/', (req,res) => {
    let newClient = req.body
    return clientController.createClient(newClient,req.user.id)
    .then(client => {
        logger.info('Cliente creado correctamente')
        res.status(201).json(client)
    })
    .catch(err => {
        console.log(err)
        logger.error('No se pudo crear el cliente', err)
        res.status(500).json(err)
    })
})


// Editar imagen 
clientsRouter.put('/:id', jwtAuthenticate, (req, res) => {
    let updateBanner = req.body
    let id = req.params.id
    return clientController.editClient(id, updateBanner)
    .then(client => {
        logger.info('El cliente se ha actualizado correctamente')
        res.json(client)
    })
    .catch(err => {
        logger.info('No se logro editar el banner')
        res.status(500).json('Error al editar el cliente', err)
    })
})

// Obtener un producto por su id 
clientsRouter.get('/:id', (req, res) => {
    let id = req.params.id
    return clientController.getClient(id)
    .then(client => {
        res.json(client)
    })
    .catch(err => {
        logger.info('No se logro mostrar el cliente')
        res.status(500).json('El id del banner no existe', err)
    })
})

// Eliminar un producto
clientsRouter.delete('/:id', jwtAuthenticate, (req, res) => {
    let id = req.params.id
    return clientController.deleteClient(id)
    .then(result => {
        logger.info('El cliente fue eliminado')
        res.status(200).json('Se elimino correctamente el cliente')
    })
    .catch(err => {
        logger.info('No se logro eliminar el cliente')
        res.status(500).json('No se puede eliminar el cliente', err)
    })
})

module.exports = clientsRouter