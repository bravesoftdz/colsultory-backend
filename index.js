require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const logger = require('./utils/logger')
const morgan = require('morgan')
const mongoose = require('mongoose')
const config = require('./config')

const authJWT = require('./api/libs/auth')

const passport = require('passport')
// *Le decimos al passport que utilize la autenticacion en nuestra app
passport.use(authJWT)

// Routes of API
const usersRoutes = require('./api/resources/users/users.routes')

// Conexion con Mongodb
mongoose.connect(process.env.MONGODB_URI, {
    // *Estos settings apagan warnings de mongoose
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(db => logger.info('Mongodb esta conectado'))

mongoose.connection.on('error',() => {
    logger.error('Error al conectar con Mongodb');
    process.exit(1)
})

const app = express();
// Middlewares
// *Inicializamos passport
app.use(passport.initialize())
// *Para leer formatos json de solicitudes enviados
app.use(bodyParser.json());
// * Corremos morgan, integrandolo a nuestro logger 
app.use(morgan('short', {
    stream: {
        write: message => logger.info(message.trim())
    }
}))

// Routes
app.use('/api/users',usersRoutes)

const port = process.env.PORT || config.port
app.listen(port, () => logger.info(`Server corriendo en el puerto ${port}`))
