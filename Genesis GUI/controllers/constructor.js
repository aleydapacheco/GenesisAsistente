var admin = require("firebase-admin");
var serviceAccount = require('../public/genesisFunctions/firestoreKey.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://genesis-32485-default-rtdb.firebaseio.com",
});
var db = admin.database();
let crear;

//////////////////////////// REGISTRO DE USUARIOS ////////////////////////////
async function numeroDeUsuarios(db){
    let ref = db.ref("/users");
    let numero_usuarios;
    await ref.once("value").then(function(snapshot) {
        numero_usuarios = snapshot.numChildren();
    }); return numero_usuarios;
}
    
async function updateNombreDeUsuario(ref,value,child,cell) {
    var usersRef = ref.child(child);
    let objeto = {  consultar: '',
                    name: value ,
                    pass: '',
                    cell: cell,
                };
    //console.log(typeof(objeto));
    //object
    await usersRef.update(objeto);
    console.log('Registro exitoso!')
}
    
async function buscandoCoincidencias(db,datoReferencia,datoEspecifico,longitud,usuario,cell){
    let child;
    let ref = db.ref(datoReferencia);
    await ref.once("value").then(function(snapshot){
        let data = snapshot.val();
        child = data[datoEspecifico];       
        for (let children in child){
            //console.log(child[children]);
            //console.log(children);
            let usuarioDatos = child[children]
            if (usuarioDatos['name'] == usuario){
                console.log('El nombre ' + usuario + ' ya existe en la BBDD.' )
                crear = true;
                return;
            }
        }
        if (crear == false) {
            let numUsuario = longitud + 1;
            let referencia = '/users/usuario_' + numUsuario.toString(10)
            updateNombreDeUsuario(ref,usuario,referencia,cell);
            return;
        }
    });
    return child;
}
    
let usuario = async function registrarUsuario(usuario,cell) {
    crear = false;
    let longitud = await numeroDeUsuarios(db);
    console.log(longitud);
    await buscandoCoincidencias(db,'/','users',longitud,usuario,cell);    
}


//registrarUsuario('Alejandro')

//////////////////////////// REGISTRO DE DISPOSITIVOS ////////////////////////////
const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
} 

async function updateNombreDeDispositivo(ref,tipo,value) {
    var usersRef = ref.child('/');
    if (tipo == 'actuadores') {
        let constructor = construirActuador(value)
        await usersRef.update(constructor);
        console.log('Registro exitoso!');
        return;
    }
    else if (tipo == 'sensores') {
        let constructor = construirSensor(value)
        await usersRef.update(constructor);
        console.log('Registro exitoso!');
        return;
    }
    else if (tipo == 'puerta') {
        ref = db.ref('/');
        usersRef = ref.child('/'+ value);
        let constructor = construirPuerta()
        await usersRef.update(constructor);
        console.log('Registro exitoso!');
        return;
    }
}

let dispo = async function AgregandoActuadoresSensores(habitacion,tipo,dispositivo){
    let tipoSinEspacios = tipo.replace(/ /g, "");
    let tipoSinEspaciosMinusculas = tipoSinEspacios.toLowerCase();
    let tipoSinEspaciosMinusculasSinAcentos = removeAccents(tipoSinEspaciosMinusculas);
    console.log(tipoSinEspaciosMinusculasSinAcentos);
    let dispositivoSinEspacios = dispositivo.replace(/ /g, "");
    let dispositivoSinEspaciosMinusculas = dispositivoSinEspacios.toLowerCase();
    let dispositivoSinEspaciosMinusculasSinAcentos = removeAccents(dispositivoSinEspaciosMinusculas);
    console.log(dispositivoSinEspaciosMinusculasSinAcentos);
    let habitacionSinEspacios = habitacion.replace(/ /g, "");
    let habitacionSinEspaciosMinusculas = habitacionSinEspacios.toLowerCase();
    let habitacionSinEspaciosMinusculasSinAcentos = removeAccents(habitacionSinEspaciosMinusculas);
    console.log(habitacionSinEspaciosMinusculasSinAcentos);
    switch (tipoSinEspaciosMinusculasSinAcentos) {
        case 'sensor':
            tipoSinEspaciosMinusculasSinAcentos = 'sensores'
            break;
        case 'actuador':
            tipoSinEspaciosMinusculasSinAcentos = 'actuadores'
            break;
    }
    let direccion = habitacionSinEspaciosMinusculasSinAcentos + '/' + tipoSinEspaciosMinusculasSinAcentos
    let child;
    let ref = db.ref(direccion);
        await ref.once("value").then(function(snapshot){
            let data = snapshot.val();
            console.log(data);
            //child = data[datoEspecifico];       
            //console.log(child)
            for (const atributos in data) {
                if (atributos == dispositivoSinEspaciosMinusculasSinAcentos) {
                    console.log('El dispositivo ' + dispositivoSinEspaciosMinusculasSinAcentos + ' ya existe. ')
                    return
                }
            }
            console.log('El dispositivo ' + dispositivoSinEspaciosMinusculasSinAcentos + ' no existe en la BBDD, se procede a crear un nuevo dispositivo. ');
            updateNombreDeDispositivo(ref,tipoSinEspaciosMinusculasSinAcentos,dispositivoSinEspaciosMinusculasSinAcentos)
        });
    return child;
}

let puerta = async function AgregandoPuertas(tipo,dispositivo){
    let tipoSinEspacios = tipo.replace(/ /g, "");
    let tipoSinEspaciosMinusculas = tipoSinEspacios.toLowerCase();
    let tipoSinEspaciosMinusculasSinAcentos = removeAccents(tipoSinEspaciosMinusculas);
    console.log(tipoSinEspaciosMinusculasSinAcentos);
    let dispositivoSinEspacios = dispositivo.replace(/ /g, "");
    let dispositivoSinEspaciosMinusculas = dispositivoSinEspacios.toLowerCase();
    let dispositivoSinEspaciosMinusculasSinAcentos = removeAccents(dispositivoSinEspaciosMinusculas);
    console.log(dispositivoSinEspaciosMinusculasSinAcentos);
    let ref = db.ref('/');
    await ref.once("value").then(function(snapshot){
        let data = snapshot.val();
        //console.log(data);
        for (const datas in data) {
            if (datas == dispositivoSinEspaciosMinusculasSinAcentos) {
                console.log('El dispositivo ' + dispositivoSinEspaciosMinusculasSinAcentos + ' ya existe. ');
                return;
            }
        }
        console.log('El dispositivo ' + dispositivoSinEspaciosMinusculasSinAcentos + ' no existe en la BBDD, se procede a crear un nuevo dispositivo. ');
        updateNombreDeDispositivo(ref,tipoSinEspaciosMinusculasSinAcentos,dispositivoSinEspaciosMinusculasSinAcentos)
    });
}

//AgregandoActuadoresSensores(habitacion,tipo,dispositivo)
//AgregandoPuertas('Puerta','Puerta Principal');

function construirActuador(dispositivo) {
    let disp = dispositivo
    let atributoUno = 'automaticoanterior' + disp
    let atributoDos = 'automaticohoraoff' + disp
    let atributoTres = 'automaticohoraon' + disp
    let atributoCuatro = 'automatico' + disp
    let atributoCinco = 'date' + disp
    let atributoSeis = 'nombre' + disp
    let atributoSiete = disp
    let actuador = '{ ' + '"' + atributoUno + '"' + ': false, ' 
                        + '"' + atributoDos + '"' + ': " ", '
                        + '"' + atributoTres + '"' + ': " ", '
                        + '"' + atributoCuatro + '"' + ': false, '
                        + '"' + atributoCinco + '"' + ': " ", '
                        + '"' + atributoSeis + '"' + ': " ", '
                        + '"' + atributoSiete + '"' + ': false '
                        +
                    '}';
    let actuadorObjeto = JSON.parse(actuador);
    console.log(actuadorObjeto)
    return(actuadorObjeto)
}

function construirSensor(dispositivo) {
    let disp = dispositivo
    let atributoUno = 'date' + disp
    let atributoDos = disp

    let sensor = '{ '   + '"' + atributoUno + '"' + ': " ", '
                        + '"' + atributoDos + '"' + ': false '
                        +
                  '}';
    let sensorObjeto = JSON.parse(sensor);
    console.log(sensorObjeto)
    return(sensorObjeto)
}

function construirPuerta() {
    let atributoUno = 'automatic' 
    let atributoDos = 'automaticanterior' 
    let atributoTres = 'chapa' 
    let atributoCuatro = 'contacto_c' 
    let atributoCinco = 'contacto_m' 
    let atributoSeis = 'contacto_m_dos' 
    let atributoSiete = 'h_puerta_contacto_c'
    let atributoOcho = 'h_puerta_contacto_m'
    let atributoNueve = 'h_puerta_contacto_m_dos'
    let atributoDiez = 'motor'
    let atributoOnce = 'nombre'
    let puerta = '{ ' + '"' + atributoUno + '"' + ': false, ' 
                        + '"' + atributoDos + '"' + ': false, ' 
                        + '"' + atributoTres + '"' + ': " ", '
                        + '"' + atributoCuatro + '"' + ': false, '
                        + '"' + atributoCinco + '"' + ': false, '
                        + '"' + atributoSeis + '"' + ': false, '
                        + '"' + atributoSiete + '"' + ': " ", '
                        + '"' + atributoOcho + '"' + ': " ", '
                        + '"' + atributoNueve + '"' + ': " ", '
                        + '"' + atributoDiez + '"' + ': false, '
                        + '"' + atributoOnce + '"' + ': " " '
                        +
                    '}';
    let puertaObjeto = JSON.parse(puerta);
    console.log(puertaObjeto)
    return(puertaObjeto)
}
//export { registrarUsuario, AgregandoPuertas, AgregandoActuadoresSensores }
module.exports = {
    usuario,
    dispo,
    puerta
}

