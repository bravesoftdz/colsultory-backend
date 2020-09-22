require('dotenv').config()
const models = require('./models')
const express = require('express')
const bodyParser = require('body-parser')
const logger = require('./utils/logger')
const morgan = require('morgan')
const multer = require('multer')
const path = require('path')
const { v4: uuidv4 }  = require('uuid')

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
app.use(passport.initialize())
// *Para leer formatos json de solicitudes enviados
app.use(bodyParser.json());
// * Corremos morgan, integrandolo a nuestro logger 
app.use(morgan('short', {
    stream: {
        write: message => logger.info(message.trim())
    }
}))
app.use(bodyParser.raw({type: 'image/*', limit: '8mb'}))
const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/img/uploads') ,
    filename: (req,file,cb,filename) => {
        cb(null, uuidv4() + path.extname(file.originalname));
    }
})

app.get('/', async (req,res)=> {
    let user = await models.user.findAll();
    return res.json(user)
})

console.log(storage)
const upload = multer({ storage: storage });
app.use(multer({
   storage: storage
}).single('image'))

// Static files
app.use(express.static(path.join(__dirname, 'public')))

// Routes
app.use('/api/users',usersRoutes)
app.use('/api/banners',bannersRouter)
app.use('/api/clients', clientsRouter)
app.use('/api/gmail',gmailRouter)

app.post("/upload", upload.single('image'),async (req, res) => {
        console.log("uploading...");
        console.log(req.file.filename);
        res.json(`/img/uploads/${req.file.filename}`)
});

module.exports = app;
