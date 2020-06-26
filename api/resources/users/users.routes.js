const express = require('express');
const usersController = require('./users.controller');
const logger = require('../../../utils/logger');
const validateUser = require('./users.validate')
const usersRouter = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const config = require('../../../config')
const passport = require('passport')

// Autenticación
const jwtAuthenticate = passport.authenticate('jwt', { session: false });

// Transformamos el username y el email en minusculas 
function bodyLowercase(req,res,next) {
    req.body.username && (req.body.username = req.body.username.toLowerCase());
    req.body.email && (req.body.email = req.body.email.toLowerCase());
    next();
}

usersRouter.get('/', (req, res) => {
    usersController.getUsers()
    .then(users => {
        res.json(users)
    })
})

usersRouter.post('/signup',[validateUser, bodyLowercase],(req, res) => {
    let newUser = req.body
    // Necesitamos verificar que el usuario ya esta registrado
    usersController.userExist(newUser.username, newUser.email)
        .then(userExits => {
            if (userExits) {
                logger.warn(`Email ${newUser.email} o Username ${newUser.username} ya existen`);
                res.status(409).send('El email o el username de usuario ya estan siendo usados')
                return
            }

            // Si no esta registrado, hasheamos el password que mandamos
            bcrypt.hash(newUser.password, 10, (err, hashedPassword) => {
                if (err) {
                    logger.info('Ocurrió un error al encriptar la contraseña');
                    res.status(500).send('Ocurrió un error al crear un usuario');
                    return
                }

                usersController.createUser(newUser,hashedPassword)
                    .then(user => {
                        logger.info('Usuario creado correctamente');
                        res.status(201).json(user)
                    })
                    .catch(error => {
                        logger.error('Usuario no pudo ser creado');
                        res.status(500).send('Ha ocurrido un error, el usuario no se creo')
                    })
            })

        })
        .catch(err => {
            logger.error(`Error ocurrio al tratar de verificar si el email ${newUser.email} o el usuario ${newUser.username} existen`);
            res.status(500).send('Error ocurrió al trata de crear un nuevo usuario')
        })
})

usersRouter.post('/login', async (req,res) => {
    let userNoAuth = req.body
    let userRegistered;

    try {
        userRegistered = await usersController.getUser({
            email: userNoAuth.email
        })
    } catch (error) {
        logger.error(`Error ocurrió al tratar de ver al usuario ${userNoAuth.email} si existe`);
        res.status(500).send('Ha ocurrido un error al procesar el login');
        return
    }

    if(!userRegistered) {
        logger.info(`Usuario con el email ${userNoAuth.email} no existe`)
        res.status(400).send('Este usuario no se encuentra registrado');
        return
    }

    let passwordCorrect;

    try {
        passwordCorrect = await bcrypt.compare(userNoAuth.password, userRegistered.password)
    } catch (error) {
        logger.error(`Error ocurrió al verificar si la contraseña era correcta`);
        res.status(500).send('Error al procesar el login');
    }

    if(passwordCorrect) {
        let token = jwt.sign({ id: userRegistered.id }, config.jwt.SECRET, { expiresIn: config.jwt.EXPIRES })
        logger.info(`Usuario con email ${userRegistered.email} completo autenticación correctamente`);
        res.status(200).json({ token })
    } else {
        logger.info(`Usuario con email ${userRegistered.email} no completo autenticación`)
        res.status(400).send('Credenciales incorrectos. Escribe bien el correo y la contraseña');
    }
})

usersRouter.get('/me',jwtAuthenticate,(req, res) => {
    res.json(req.user)
})

module.exports = usersRouter;