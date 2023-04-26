const express = require('express')
//uso de login
const cookieParser = require('cookie-parser')
const session = require('express-session');
const path = require('path');
const flash = require('connect-flash');
const dotenv = require('dotenv')
dotenv.config({path:'.env'});

const app = express()

//Motor de plantillas o setting
app.set('views',path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,'public')));
app.set('view engine','ejs');

//para procesar datos enviados desde forms
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(flash());
app.use(session({

	secret:'12345',
	resave:false,
	saveUninitialized:false

}));

//seteamos las variables de entorno
dotenv.config({path: './env/.env'})

//para poder trabajar con las cookies
app.use(cookieParser())

// Configuración de express-flash
app.use((req, res, next) => {
    app.locals.messages = req.flash('success');
    next();
});
// //es para usar en la carpeta app import
// app.use('/', require('./router'));

//llamar al router
app.use('/', require('./routes/router'))

//Para eliminar la cache al volver atras en la web
app.use(function(req, res, next) {
    if (!req.user)
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next();
});

//escuchando al PORT
app.listen(3000, ()=>{
    console.log('SERVER UP running in http://localhost:3000')
})