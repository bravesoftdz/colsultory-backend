var debug = require('debug')('backenconsultory:server');
var http = require('http');
const logger = require('./utils/logger')
require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const multer = require('multer')
const models = require('./models')
const path = require('path')
const { v4: uuidv4 } = require('uuid')
const cors = require('cors')

const authJWT = require('./api/libs/auth')

const passport = require('passport')
// *Le decimos al passport que utilize la autenticacion en nuestra app
passport.use(authJWT)

const usersRoutes = require('./api/resources/users/users.routes')
const bannersRouter = require('./api/resources/banners/banner.routes')
const clientsRouter = require('./api/resources/clients/client.routes')
const gmailRouter = require('./gmail')

const app = express();
// Middlewares
// *Inicializamos passport
app.use(cors())
app.use(passport.initialize())
// *Para leer formatos json de solicitudes enviados
app.use(bodyParser.json());
// * Corremos morgan, integrandolo a nuestro logger 
app.use(morgan('short', {
  stream: {
    write: message => logger.info(message.trim())
  }
}))
app.use(bodyParser.raw({ type: 'image/*', limit: '8mb' }))

const storage = multer.diskStorage({
  destination: path.join(__dirname, 'public/img/uploads'),
  filename: (req, file, cb, filename) => {
    cb(null, uuidv4() + path.extname(file.originalname));
  }
})

console.log(storage)
const upload = multer({ storage: storage });
app.use(multer({
  storage: storage
}).single('image'))

// Static files
app.use(express.static(path.join(__dirname, 'public')))

// Routes
app.use('/api/users', usersRoutes)
app.use('/api/banners', bannersRouter)
app.use('/api/clients', clientsRouter)
app.use('/api/gmail', gmailRouter)

app.post("/api/banners/upload", upload.single('image'), async (req, res) => {
  try {
    const image = await models.banner.create({
      title: req.file.originalname,
      image: `http://api.consultorioempresarial.pe/img/uploads/${req.file.filename}`
    })
    res.json(image)
  } catch (error) {
    logger.error('No se pudo crear el banner', error)
    res.status(500).json(error)
  }
});

app.post("/api/clients/upload", upload.single('image'), async (req, res) => {
  try {
    const image = await models.client.create({
      title: req.file.originalname,
      image: `http://api.consultorioempresarial.pe/img/uploads/${req.file.filename}`
    })
    res.json(image)
  } catch (error) {
    logger.error('No se pudo crear el cliente', error)
    res.status(500).json(error)
  }
});

var port = normalizePort(process.env.PORT || '8081');
app.set('port', port);

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
logger.info('Informando en el servidor')

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
