const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')

//Router para las vistas
router.get('/',authController.isAuthenticated,(req,res)=>{
    res.render('indexx',{user:req.user})
})
router.get('/login', (req,res)=>{
    res.render('login', {alert: false})
})
router.get('/register', (req,res)=>{
    res.render('register')
})

////////////////////////////////////////

//Router para los metodos del controller de VIEWS
router.post('/register', authController.register)
router.post('/login', authController.login)
router.get('/logout', authController.logout)
router.get('/cambioContrasena', authController.cambiarContrasena)

router.get('/habitaciones/:id', authController.habitacionesPorId)

//Router para los archivos multimedia
router.get('/camara', authController.camara)
//Router para los administracion de Usuarios
router.get('/disuasiones', authController.disuasiones)
router.get('/socorro', authController.socorro)

router.get('/users', authController.usersLeer)
router.post('/users', authController.usersRegistrar)
router.put('/users/:id', authController.usersActualizar)
router.delete('/users/:id', authController.usersBorrar)
//Router para los administracion de los Dispositivos
router.get('/dispositivos', authController.dispositivosLeer)
router.post('/dispositivos', authController.dispositivosRegistrar)
router.put('/dispositivos/:id', authController.dispositivosActualizar)
router.delete('/dispositivos/:id', authController.dispositivosBorrar)
router.get('/pines',authController.dispositivosLeerPines)
router.get('/habitaciones', authController.habitacionesLeer)
router.post('/habitaciones', authController.habitacionesRegistrar)
router.put('/habitaciones/:id', authController.habitacionesActualizar)
router.delete('/habitaciones/:id', authController.habitacionesBorrar)
//Exportando el modulo 'router'
module.exports = router