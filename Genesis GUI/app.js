const express = require('express')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const app = express()
const http = require('http');
const hostname = '192.168.0.250';
const port = 3000;

//Seteando el motor de plantillas para Node
app.set('view engine','ejs')

//Seteando la carpeta public para archivos estaticos
app.use(express.static('public'))

//Para procesar datos enviados desde forms
app.use(express.urlencoded({extended:true}))
app.use(express.json())
//Seteando las variables de entorno
dotenv.config({path: './env/.env'})
//Para poder trabajar con las cookies
app.use(cookieParser())
//Llamar al router desde su ubicacion
app.use('/',require('./routes/router'))
//Funcion para eliminar la cache despues de un Logout
app.use(function(req,res,next){
    if (!req.user) {
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        next();
    }
})
app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`); 
});