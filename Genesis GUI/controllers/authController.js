const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const conexion = require('../database/db')
const constructor = require('./constructor');
const {promisify} = require('util')


//Procedimiento de REGISTRO
exports.register =  async (req,res) => {
    let name = req.body.name;
    let user = req.body.user;
    let pass = req.body.pass;
    let rol = req.body.rol;
    let passConf = req.body.passConf;
    let passHash = await bcryptjs.hash(pass,8)
    console.log(name + ' - ' + user + ' - ' + pass + ' - ' + rol + ' - ' + passConf)
    if (pass == passConf) {
        conexion.query('SELECT * FROM users where u_nombre=? or u_usuario=?',[name,user], async (error, results, fields) =>{
            if (Object.keys(results).length > 0) {
                console.log(results[0]);
                console.log('Nombre y/o Usuario existente. Trata de escribir nuevamente tus datos completos y de manera correcta');
            }
            else{
                let hoy = new Date();
                let fecha = hoy.getFullYear() + '-' + (hoy.getMonth() + 1) + '-' + hoy.getDate();
                let hora = hoy.getHours() + ':' + hoy.getMinutes() + ':' + hoy.getSeconds();
                let fechaYHora = fecha + ' ' + hora;
                console.log('Usted puede registrarse!')
                conexion.query('INSERT INTO users SET ?',{u_nombre:name, u_usuario:user, u_password:passHash, u_fecha_hora:fechaYHora, u_rol:rol}, async(error,results)=>{
                    if(error){
                        console.log(error);
                    }
                    else{                                              
                        console.log('Registro Exitoso!!')
                        res.redirect('/')
                    }
                });
            }
        });
    }
    else{
        console.log('Confirmacion de contrasena incorrecta')
    }
}
exports.login = async (req,res) => {
    let usuario;
    try {
        const user = req.body.user;
        let password = req.body.pass;

        if (!user || !password){
            res.render('login',{
                alert: true,
                alertTitle: "Advertencia",
                alertMessage: "Ingrese un usuario y/o contrasena",
                alertIcon: 'info',
                showConfirmButton: true,
                timer: false,
                ruta: 'login'
            })
        }
        else{
            conexion.query('SELECT * FROM users WHERE u_usuario=? ',[user], async (error, results, fields) =>{
                for (let i = 0; i < Object.keys(results).length; i++) {
                    //Consulta de coincidencia de usuario
                    if(Object.keys(results).length == 0 || !(await bcryptjs.compare(password,results[i].u_password))){
                        res.render('login',{
                            alert:true,
                            alertTitle: "Error",
                            alertMessage: "Usuario y/o Password incorrectas",
                            alertIcon: "error",
                            showConfirmButton: true,
                            timer: false,
                            ruta: 'login'
                        });
                        console.log('Error de autentificacion de usuario. Intente nuevamente.');
                    }
                    else{
                        let id = results[i].users_id;
                        usuario = results[i].u_nombre;
                        let token = jwt.sign({id:id}, process.env.JWT_SECRETO, {
                            expiresIn: process.env.JWT_TIEMPO_EXPIRA
                        })
                        let cookiesOptions = {
                            expires: new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                            httpOnly: true
                        }
                        res.cookie('jwt',token, cookiesOptions)
                        res.render('login',{
                            alert:true,
                            alertTitle: "Conexion exitosa",
                            alertMessage: "LOGIN CORRECTO!",
                            alertIcon: "success",
                            showConfirmButton: false,
                            timer: 800,
                            ruta: '',
                            user:usuario,
                        })
                        
                        console.log(usuario);
                        console.log('Autentificacion exitosa. Bienvenid@!');
                        console.log(token);
                        break;
                    }
                }     
            });
        }
    } 
    catch (error) {
        console.log(error)
    } 
}
exports.isAuthenticated = async (req,res,next) => {
    let pasarDato;
    if(req.cookies.jwt) {
        
        try {
            let decodificada = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO)
            conexion.query('SELECT * FROM users WHERE users_id=?',[decodificada.id],(error,results) => {
                if (!results){return next()}
                req.user = results[0];
                pasarDato = results[0].u_nombre;
                console.log(pasarDato);
                return next()
            })
        } 
        catch (error) {
            console.log(error)
        }
    }
    else{
        res.redirect('/login')
    }
}
exports.logout = (req,res) => {
    res.clearCookie('jwt')
    return res.redirect('/login')
}

//Callbacks del tipo GET para informacion de los SENSORES iterables

exports.habitacionprincipalactuadorluzhabitacionprincipal = (req,res) => {
    conexion.query('SELECT * FROM habitacionprincipalactuadorluzhabitacionprincipal ORDER by id DESC',(error,results)=>{
        if (error){
            res.send(error);
        }
        else{
            res.send(results);              
        }
    });
}
exports.habitacionprincipalsensoraperturapuertabalcon = (req,res) => {
    conexion.query('SELECT * FROM habitacionprincipalsensoraperturapuertabalcon ORDER by id DESC',(error,results)=>{
        if (error){
            res.send(error);
        }
        else{
            res.send(results);              
        }
    });
}
exports.jardinactuadorlucesjardin = (req,res) => {
    conexion.query('SELECT * FROM jardinactuadorlucesjardin ORDER by id DESC',(error,results)=>{
        if (error){
            res.send(error);
        }
        else{
            res.send(results);              
        }
    });
}
exports.jardinsensormovimientojardin = (req,res) => {
    conexion.query('SELECT * FROM jardinsensormovimientojardin ORDER by id DESC',(error,results)=>{
        if (error){
            res.send(error);
        }
        else{
            res.send(results);              
        }
    });
}
exports.jardinsensorperimetralperimetroprincipal = (req,res) => {
    conexion.query('SELECT * FROM jardinsensorperimetralperimetroprincipal ORDER by id DESC',(error,results)=>{
        if (error){
            res.send(error);
        }
        else{
            res.send(results);              
        }
    });
}
exports.jardinpuertapuertaprincipal = (req,res) => {
    conexion.query('SELECT * FROM jardinpuertapuertaprincipal ORDER by id DESC',(error,results)=>{
        if (error){
            res.send(error);
        }
        else{
            res.send(results);              
        }
    });
}
exports.tiendasensoraperturapuertagaraje = (req,res) => {
    conexion.query('SELECT * FROM tiendasensoraperturapuertagaraje ORDER by id DESC',(error,results)=>{
        if (error){
            res.send(error);
        }
        else{
            res.send(results);              
        }
    });
}
exports.tiendasensoraperturaventanabano = (req,res) => {
    conexion.query('SELECT * FROM tiendasensoraperturaventanabano ORDER by id DESC',(error,results)=>{
        if (error){
            res.send(error);
        }
        else{
            res.send(results);              
        }
    });
}
exports.tiendasensormovimientosalidatienda = (req,res) => {
    conexion.query('SELECT * FROM tiendasensormovimientosalidatienda ORDER by id DESC',(error,results)=>{
        if (error){
            res.send(error);
        }
        else{
            res.send(results);              
        }
    });
}

exports.habitacionesPorId = (req,res) => {
    let id = req.params.id;
    //console.log(id);
    let sqlUno = 'SELECT * FROM dispositivos WHERE id=?';
    conexion.query(sqlUno,[id],async(error,results,fields)=>{
        if (Object.keys(results.length>0)) {
            let nombreTabla = results[0].tabla;
            let sqlDos = 'SELECT * FROM ' + nombreTabla + ' ORDER BY id DESC';
            conexion.query(sqlDos,(error,results)=>{
                if (error){
                    res.send(error);
                }
                else{
                    res.send(results);              
                }
            });
        }
    });
}

//Callbacks del tipo GET para informacion MULTIMEDIA
exports.camara = (req,res) => {
    conexion.query('SELECT * FROM camara ORDER by camara_id DESC',(error,results)=>{
        if (error){
            res.send(error);
        }
        else{
            res.send(results);              
        }
    });
}

//Callbacks para la administracion de USUARIOS
exports.disuasiones = (req,res) => {
    conexion.query('SELECT * FROM disuasiones ORDER by disuasiones_id DESC',(error,results)=>{
        if (error){
            res.send(error);
        }
        else{
            res.send(results);              
        }
    });
}
exports.socorro = (req,res) => {
    conexion.query('SELECT * FROM socorro ORDER by socorro_id DESC',(error,results)=>{
        if (error){
            res.send(error);
        }
        else{
            res.send(results);              
        }
    });
}
exports.usersLeer = (req,res) => {
    conexion.query('SELECT * FROM users ORDER by users_id DESC',(error, results) =>{
        if (error) {
            throw error;
        }
        else{
            res.send(results);
        }
    })
}
exports.usersRegistrar = async (req,res) => {
    //Almacenando la informacion enviada mediante un callback GET desde HTML necesaria en variables 
    let nombreCompletoRegister = req.body.nombre;
    let usuarioRegister = req.body.usuario;
    let rolRegister = req.body.rol;
    let contrasenaRegister = req.body.contrasena;
    let celularRegister = req.body.celular;
    let contrasenaHash = await bcryptjs.hash(contrasenaRegister,8);
    let sqlUno = 'SELECT * FROM users where u_nombre=? or u_usuario=?';

    //Query de consulta para el descarte de usuarios duplicados
    conexion.query(sqlUno,[nombreCompletoRegister,usuarioRegister], async (error, results, fields) =>{
        if (Object.keys(results).length > 0) {
            console.log(results);
            console.log('Nombre y/o Usuario existente. Trata de escribir nuevamente tus datos completos y de manera correcta');
            res.send({
                mensaje:'Nombre y/o Usuario existente.'
            });
        }
        else{
            //Seccion de peticion query para el registro de Nuevos Usuarios
            let data = {u_nombre:nombreCompletoRegister,u_usuario:usuarioRegister,u_rol:rolRegister,u_password:contrasenaHash,u_celular:celularRegister};
            let sqlDos = 'INSERT INTO users SET ?';
            conexion.query(sqlDos, data, async (error, results, fields) =>{
                if (error) {
                    throw error;
                }
                else{
                    constructor.usuario(usuarioRegister,celularRegister);
                    console.log('Registro Exitoso Nuevo Usuario Firebase!!')
                    res.send(results);
                }
            });
        }
    });
}
exports.usersActualizar = (req,res) => {
    let id = req.body.id;
    let nombre = req.body.nombre;
    let usuario = req.body.usuario;
    let rol = req.body.rol;
    let celular = req.body.celular;
    let sql = "UPDATE users SET u_nombre = ?, u_usuario = ?, u_rol = ? , u_celular = ? WHERE users_id = ?";
    conexion.query(sql,[nombre,usuario,rol,celular,id], function(error,results){
        if (error) {
            throw error;
        }
        else{
            res.send(results);
        }
    });
}
exports.usersBorrar = (req,res) => {
    let id = req.params.id;
    let sql = 'DELETE FROM users WHERE users_id = ?';
    conexion.query(sql,[id], function(error, results){
        if (error) {
            throw error;
        }
        else{
            res.send(results);
        }
    });
}

//Callbacks para la administracion de nuevos DISPOSITIVOS
exports.dispositivosLeer = (req,res) => {
    conexion.query('SELECT * FROM dispositivos ORDER by id DESC',(error,results)=>{
        if (error){
            res.send(error);
        }else{
            //console.log(results);
            res.send(results);              
        }
    });
}
exports.dispositivosRegistrar = async (req,res) => {
    const removeAccents = (str) => {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    } 
    let nombreDispositivo = req.body.nombre;
    let nombreHabitacion = req.body.habitacion;
    let nombreIcono = req.body.icono;
    let nombreTipo = req.body.tipo;
    let nombrePin = req.body.pin;
    let sqlUno = 'SELECT * FROM dispositivos where nombre=?';
    let sqlDos = 'INSERT INTO dispositivos SET ?';
    let nombreDeTablaACrear =  nombreHabitacion + nombreTipo + nombreDispositivo;
    let nombreDeTablaACrearSinEspacios = nombreDeTablaACrear.replace(/ /g, "");
    let nombreDeTablaACrearSinEspaciosMinusculas = nombreDeTablaACrearSinEspacios.toLowerCase();
    let nombreDeTablaACrearSinEspaciosMinusculasSinAcentos = removeAccents(nombreDeTablaACrearSinEspaciosMinusculas);
    let sqlConsultarExistenciaDeTabla = 'SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME LIKE ?';
    let headersDispositivo;
    let tipoDispositivo;
    switch (nombreTipo) {
        case 'Sensor apertura':
            headersDispositivo = 'S. Apertura';
            break;
        case 'Sensor movimiento':
            headersDispositivo = 'S. Movimiento';
            break;
        case 'Sensor perimetral':
            headersDispositivo = 'S. Perimetral';
        case 'Actuador':
            headersDispositivo = 'E. Activacion';
            break;       
        case 'Puerta':
            headersDispositivo = ['Estado','Medio','S. Mov. Anterior','S. Mov. Posterior','Automatico'];
            break;
    }
    if ((nombreTipo == 'Sensor apertura') || (nombreTipo == 'Sensor movimiento') || (nombreTipo == 'Sensor perimetral')) {
        tipoDispositivo = 'Sensor';
    }
    else{
        tipoDispositivo = nombreTipo;
    }
    let data = {nombre:nombreDispositivo,habitacion:nombreHabitacion,tipo:tipoDispositivo,tabla:nombreDeTablaACrearSinEspaciosMinusculasSinAcentos,header:headersDispositivo,icono:nombreIcono,tipoEspecifico:nombreTipo,pin:nombrePin};

        conexion.query(sqlConsultarExistenciaDeTabla,[nombreDeTablaACrearSinEspaciosMinusculas], async(error,results,fields) => {           
            //console.log(nombreDeTablaACrear);
            //console.log(nombreDeTablaACrearSinEspacios);
            //console.log(nombreDeTablaACrearSinEspaciosMinusculas);
            //console.log(sqlConsultarExistenciaDeTabla);
            //console.log(results);

            console.log(headersDispositivo);
            console.log(tipoDispositivo);
            //Consultando la existencia de tablas con el mismo nombre
            if (Object.keys(results).length > 0) {
                console.log('Se encontro una tabla que coincide con el nombre de dispositvo asignado. Prueba una vez mas')
                res.send({
                    mensaje:'Se encontro una tabla que coincide con el nombre de dispositvo asignado. Prueba una vez mas'
                });
            }
            else{                
                conexion.query(sqlUno, [nombreHabitacion], function(error, results, fields){
                    //Consultando la existencia del dispositivo
                    if (Object.keys(results).length > 0) {
                        console.log(results);
                        console.log('Nombre de dispositivo ya existente. Trata de escribir nuevamente los datos.');
                        res.send({
                            mensaje:'Nombre de dispositivo ya existente. Trata de escribir nuevamente los datos.'
                        });
                    }
                    else {
                        let sqlCreateTable = 'CREATE TABLE IF NOT EXISTS ' + nombreDeTablaACrearSinEspaciosMinusculasSinAcentos + ' (`id` int(11) NOT NULL AUTO_INCREMENT, `estado` varchar(40) DEFAULT NULL, `fechaYHora` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (`id`)) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8'
                        conexion.query(sqlCreateTable, function(error,results,fields) {
                            if (error) {
                                console.log('Error!!!!')
                                console.log(error)
                                throw error;
                            }
                            else{
                                console.log('Nueva tabla creada con el nombre de: ' + nombreDeTablaACrearSinEspaciosMinusculas);                              
                            }
                        });

                        conexion.query(sqlDos, data, function (error, results, fields) {
                            if (error) {
                                console.log('Error!!!!')
                                console.log(error)
                                throw error;
                            }
                            else{
                                if ((tipoDispositivo == 'Sensor') || (tipoDispositivo == 'Actuador')) {
                                    constructor.dispo(nombreHabitacion,tipoDispositivo,nombreDispositivo);
                                }
                                else if (tipoDispositivo == 'Puerta') {
                                    constructor.puerta(tipoDispositivo,nombreDispositivo);
                                }
                                else{
                                    console.log('No se pudo crear ' + nombreDispositivo + ' en Firebase!');
                                }
                                console.log('Nuevo dispositivo creado con el nombre: ' + nombreDispositivo); 
                                res.send(results);                                                                                       
                            }
                        });
                    }
                });
            }    
        });
}
exports.dispositivosActualizar = (req,res) => {
    let id = req.body.id;
    let nombre = req.body.nombre;
    let habitacion = req.body.habitacion;
    let icono = req.body.icono;
    let nombreTipo = req.body.tipo;
    let nombrePin = req.body.pin;
    let headersDispositivo;
    let tipoDispositivo;
    switch (nombreTipo) {
        case 'Sensor apertura':
            headersDispositivo = 'S. Apertura';
            break;
        case 'Sensor movimiento':
            headersDispositivo = 'S. Movimiento';
            break;
        case 'Sensor perimetral':
            headersDispositivo = 'S. Perimetral';
        case 'Actuador':
            headersDispositivo = 'E. Activacion';
            break;       
        case 'Puerta':
            headersDispositivo = ['Estado','Medio','S. Mov. Anterior','S. Mov. Posterior','Automatico'];
            break;
    }
    if ((nombreTipo == 'Sensor apertura') || (nombreTipo == 'Sensor movimiento') || (nombreTipo == 'Sensor perimetral')) {
        tipoDispositivo = 'Sensor';
    }
    else{
        tipoDispositivo = nombreTipo;
    }

    let sql = "UPDATE dispositivos SET nombre = ?, habitacion = ?, icono = ?, tipo = ? ,tipoespecifico = ?, header = ?, pin = ? WHERE id = ?";
    conexion.query(sql,[nombre,habitacion,icono,tipoDispositivo,nombreTipo,headersDispositivo,nombrePin,id], function(error,results){
        if (error) {
            throw error;
        }
        else{
            res.send(results);
        }
    });
}
exports.dispositivosBorrar = (req,res) => {
    let id = req.params.id;
    let sql = 'DELETE FROM dispositivos WHERE id = ?';
    conexion.query(sql,[id], function(error, results){
        if (error) {
            throw error;
        }
        else{
            res.send(results);
        }
    });
}
exports.dispositivosLeerPines = (req,res) =>{
    conexion.query('SELECT pin FROM dispositivos ',(error,results)=>{
        if (error){
            res.send(error);
        }else{
            res.send(results);              
        }
    });
}
exports.habitacionesLeer = (req,res) => {
    conexion.query('SELECT * FROM habitaciones ORDER by id DESC',(error,results)=>{
        if (error){
            res.send(error);
        }else{
            //console.log(results);
            res.send(results);              
        }
    });
}
exports.habitacionesRegistrar = (req,res) => {
    let nombreHabitacion = req.body.nombre;
    let sqlUno = 'SELECT * FROM habitaciones where nombre=?';

    //Query de consulta para el descarte de usuarios duplicados
        conexion.query(sqlUno,[nombreHabitacion], async (error, results, fields) =>{
            if (Object.keys(results).length > 0) {
                console.log(results);
                console.log('Nombre de habitacion ya existente. Trata de escribir nuevamente los datos.');
                res.send({
                    mensaje:'Nombre de habitacion existente.'
                });
            }
            else{
                let data = {nombre:nombreHabitacion};
                let sqlDos = 'INSERT INTO habitaciones SET ?';
                conexion.query(sqlDos, data, async (error, results, fields) =>{
                    if (error) {
                        throw error;
                    }
                    else{
                        res.send(results);
                    }
                });
            }
        });
}
exports.habitacionesActualizar = (req,res) => {
    let id = req.body.id;
    let nombre = req.body.nombre;
    let sql = "UPDATE habitaciones SET nombre = ? WHERE id = ?";
    conexion.query(sql,[nombre,id], function(error,results){
        if (error) {
            throw error;
        }
        else{
            res.send(results);
        }
    });
}
exports.habitacionesBorrar = (req,res) => {
    let id = req.params.id;
    let sql = 'DELETE FROM habitaciones WHERE id = ?';
    conexion.query(sql,[id], function(error, results){
        if (error) {
            throw error;
        }
        else{
            res.send(results);
        }
    });
}

//Callbacks para la administracion del cambio de contrasena
exports.cambiarContrasena = async (req,res) =>{
    let antiguaContra = req.body.contrasenaAntigua;
    let nuevaContra = req.body.contrasenaNueva;
    let nombre = req.params.nombre;
    let nuevaContraHash = await bcryptjs.hash(nuevaContra,8)

    console.log(antiguaContra);
    console.log(nuevaContra);
    console.log(nombre);


        conexion.query('SELECT * FROM users WHERE u_usuario =? ',[nombre], async (error, results, fields) =>{
            for (let i = 0; i < Object.keys(results).length; i++) {

                if(Object.keys(results).length == 0 || !(await bcryptjs.compare(antiguaContra,results[i].u_password))){             
                    console.log('Error de autentificacion de usuario. Intente nuevamente.');
                }
                else{
                    console.log('Usted puede cambiar contrasena!')
                    let hoy = new Date();
                    let fecha = hoy.getFullYear() + '-' + (hoy.getMonth() + 1) + '-' + hoy.getDate();
                    let hora = hoy.getHours() + ':' + hoy.getMinutes() + ':' + hoy.getSeconds();
                    let fechaYHora = fecha + ' ' + hora;
                    console.log(fechaYHora);
                    

                    let sql = "UPDATE users SET u_password = ?, u_fecha_hora = ? WHERE u_usuario = ?";
                    conexion.query(sql,[nuevaContraHash,fechaYHora,nombre], function(error,results){
                        if (error) {
                            console.log('Fallo en cambio de contrasena!');
                            res.send({
                                resultado: 'no'
                            })
                        }
                        else{
                            console.log('Cambio de Contrasena exitoso!');
                            res.send({
                                resultado: 'ok'
                            })
                        }
                    });
                }
            }     
        });
}