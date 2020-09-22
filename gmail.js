const express = require('express')
const gmailRouter = express.Router();
const nodemailer = require('nodemailer')

gmailRouter.post('/',(req,res) => {
    let data = req.body
    let smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        port: 465,
        auth: {
            user: "rhaegarcode@gmail.com",
            pass: "jlujjlelsptmtcsv"
        }
    });

    let mailOptions =  {
        from: data.email,
        to: "rhaegarcode@gmail.com",
        subject: `Mensaje de ${data.user}`,
        html: 
            `<h3>Información</h3>
            <ul>
                <li>Nombre Completo: ${data.user}</li>
                <li>Teléfono: ${data.phone}</li>
                <li>Correo: ${data.email}</li>
            </ul>
            <h3>Asunto</h3>
            <p>${data.message}</p>
            `
    }

    smtpTransport.sendMail(mailOptions, (error,response) => {
        if(error) {
            res.send(error)
        } else {
            res.send('Success')
        }
    })

    smtpTransport.close();
})

module.exports = gmailRouter