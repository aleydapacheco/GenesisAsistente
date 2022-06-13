'use strict';
const { conversation, Simple } = require('@assistant/conversation');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const app = conversation();

//////////////////////////// SECCION DE MANEJO REALTIME DATABASE PETICION DE DATOS /////////////////////////////////////////////

var config = {
    apiKey: "./firestoreKey.json",
    authDomain: "genesis-32485.firebaseapp.com",
    databaseURL: "https://genesis-32485-default-rtdb.firebaseio.com"
};

admin.initializeApp(config);
var db = admin.database();
var ref = db.ref('/');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/////////////////// AUTENTIFICACION //////////////

async function updatePassword(ref,value,child) {
    var usersRef = ref.child(child);
    await usersRef.update({ pass: value });
}
async function updateConsultar(ref,value,child) {
    var usersRef = ref.child(child);
    await usersRef.update({ consultar: value });
}
async function updateIntentname(ref,value,child) {
    var usersRef = ref.child(child);
    await usersRef.update({ intentname: value });
}
async function updateUserid(ref,value,child) {
    var usersRef = ref.child(child);
    await usersRef.update({ userid: value });
}
async function user(db){
    let ref = db.ref("/users");
    let usuarios;
    await ref.once("value").then(function(snapshot) {
        usuarios = snapshot.toJSON();
      }); return usuarios;
}
async function getDato(db,child_ide){
    let ref = db.ref(child_ide);
    let dato;
    await ref.once("value").then(function(snapshot) {
        dato = snapshot.val();
    }); return dato;
}
async function numUser(db){
    let ref = db.ref("/users");
    let numero_usuarios;
    await ref.once("value").then(function(snapshot) {
        numero_usuarios = snapshot.numChildren();
      }); return numero_usuarios;
}

/////////////////// CONSULTAS GET DISPOSITIVOS VARIOS /////////////////

async function datos(db,datoReferencia,datoEspecifico){
    let child;
    let ref = db.ref(datoReferencia);
    await ref.once("value").then(function(snapshot){
        let data = snapshot.val();
        child = data[datoEspecifico];
    });
    return child;
}

///////////////// CONSULTAS UPDATE DISPOSITIVO PUERTA ///////////////////

async function updatePuertaAutomatic(ref, value) {
    var usersRef = ref.child('puertaprincipal');
    await usersRef.update({ automatic: value });
}
async function updatePuertaNombre(ref, value) {
    var usersRef = ref.child('puertaprincipal');
    await usersRef.update({ nombre: value });
}
async function updatePuertaChapa(ref, value) {
    var usersRef = ref.child('puertaprincipal');
    await usersRef.update({ chapa: value });
}

//////////////////// CONSULTAS UPDATE SIRENA /////////////////////

async function updatePerimetroAutomatic(ref, value) {
    var usersRef = ref.child('jardin/actuadores');
    await usersRef.update({ automaticosirena: value });
}
async function updatePerimetroSirena(ref, value) {
    var usersRef = ref.child('jardin/actuadores');
    await usersRef.update({ sirena: value });
}

////////////////// CONSULTAS UPDATE LUCES DEL JARDIN ////////////////////////

async function updateLucesJardin(ref, value) {
    var usersRef = ref.child('jardin/actuadores');
    await usersRef.update({ lucesjardin: value });
}
async function updateNombreLucesJardin(ref, value) {
    var usersRef = ref.child('jardin/actuadores');
    await usersRef.update({ nombrelucesjardin: value });
}
async function updateLucesJardinAutomatic(ref, value) {
    var usersRef = ref.child('jardin/actuadores');
    await usersRef.update({ automaticolucesjardin: value });
}
async function updateLucesJardinHoraUno(ref, value) {
    var usersRef = ref.child('jardin/actuadores');
    await usersRef.update({ automaticohoraonlucesjardin: value });
}
async function updateLucesJardinHoraDos(ref, value) {
    var usersRef = ref.child('jardin/actuadores');
    await usersRef.update({ automaticohoraofflucesjardin: value });
}

///////////////////// CONSULTAS UPDATE SECCION MODOS ////////////////////////

async function updateModoModo(ref, value) {
    var usersRef = ref.child('modo');
    await usersRef.update({ modo: value });
}
async function updateModosArmadoHoraUno(ref, value) {
    var usersRef = ref.child('modo');
    await usersRef.update({ armadoon: value });
}
async function updateModosArmadoHoraDos(ref, value) {
    var usersRef = ref.child('modo');
    await usersRef.update({ armadooff: value });
}

///////////////////// CONSULTAS UPDATE NOMBRE DISUASION ////////////////////////

async function updatePerimetroNombre(ref, value) {
    var usersRef = ref.child('jardin/actuadores');
    await usersRef.update({ nombresirena: value });
}

//////////////////// SOCORRO /////////////////////

/*async function datosSocorro(ref,datoSocorro){
    let datoSocorroChild;
    await ref.once("value").then(function(snapshot) {
            let data = snapshot.val();
            datoSocorroChild = data[datoSocorro];
        }); return datoSocorroChild;
}*/

async function datosSocorro(ref,datoSocorro){
    let datoSocorroChild;
    await ref.once("value").then(function(snapshot) {
            let data = snapshot.val();
            datoSocorroChild = data[datoSocorro];
        }); return datoSocorroChild;
}

/*async function updateSocorro(ref, value) {
    await ref.update({ socorro: value });
}*/

async function updateSocorroSocorro(ref, value) {
    var usersRef = ref.child('socorro');
    await usersRef.update({ socorro: value });
}

async function updateSocorroNombre(ref, value) {
    var usersRef = ref.child('socorro');
    await usersRef.update({ nombre: value });
}
/////////////////////////////////////////////////// PROTOCOLO DE NOTIFICACIONES ///////////////////////////////////////////////////////////////

/*app.handle('resultado_si_notificaciones', async conv => {
    let nombre = conv.user.params.Name;
    let numero_usuarios = await numUser(db);
    let usuarios = await user(db);
    let child_id = identificandoChild(nombre,numero_usuarios,usuarios);
    const intentName = 'si_tarea';
    const notificationsSlot = conv.session.params['NotificationSlot_${intentName}'];
    if(notificationsSlot.permissionStatus == 'PERMISSION_GRANTED') {
      const UserId = notificationsSlot.additionalUserData.updateUserId;
      await updateIntentname(ref,intentName,child_id);
      await updateUserid(ref,UserId,child_id);
    }
    let client = auth.fromJSON(require('./genesisCuentaDeServicio.json'));
    client.scopes = ['https://www.googleapis.com/auth/actions.fulfillment.conversation'];
    let notification = {
        userNotification: {
            title: 'Example notification title',
        },
        target: {
            userId: notificationsSlot.additionalUserData.updateUserId,
            intent: intentName,
        },
    };
    client.authorize((err, tokens) => {
    if (err) {
        throw new Error('Auth error: ${err}');
    }
    request.post('https://actions.googleapis.com/v2/conversations:send', {
        'auth': {
            'bearer': tokens.access_token,
        },
        'json': true,
        'body': {'customPushMessage': notification, 'isInSandbox': true},
    }, (err, httpResponse, body) => {
        if (err) {
        throw new Error('API request error: ${err}');
        }
        console.log('${httpResponse.statusCode}: ' + '${httpResponse.statusMessage}');
        console.log(JSON.stringify(body));
    });
    });
  });*/

/////////////////////////////////////////////////// PROTOCOLO DE INICIO Y AUTENTIFICACION /////////////////////////////////////////////////////

app.handle('resultado_bienvenido', async conv => {
    await numUser(db);
    if ((conv.user.params.Name != '') && (conv.user.params.Name != null)){
        let nombre_usuario = conv.user.params.Name;
        let mensaje_bienvenida = 'Hola ' + nombre_usuario + ' un gusto volver a saber de ti!. ';
        conv.scene.next.name = "Pidiendo_Contrasena";
        return conv.add(mensaje_bienvenida);
    }
    else{
        let mensaje_bienvenida = 'Hola que tal bienvenido a Asistente Génesis, para comenzar necesito me proporciones tu nombre de usuario. ';
        conv.user.params.Name = null;
        return conv.add(mensaje_bienvenida);   
    }
});

app.handle('resultado_pidiendo_nombre', async conv => {
    let nombre = conv.intent.params.NombreUser.resolved;
    let numero_usuarios = await numUser(db);
    let usuarios = await user(db);
    let clave = 'usuario_';
    for (let id = 1; id < (numero_usuarios + 1); id++) {
        let ide = String(id);
        let clave_id = clave + ide; 
        let usuario = usuarios[clave_id];
        let nombre_usuario = usuario['name'];
        if (nombre_usuario == nombre) {
            let child = 'users/';
            let child_id = child + clave_id;
            conv.user.params.Name = nombre;
            return conv.add('Lindo nombre ' + nombre + '.');
        }
      }
    conv.add('Lo siento, no encontre tu nombre de usuario en los registros. Por favor, repite el proceso o comunícate con el administrador de Asistente Génesis mediante el siguiente correo admi_genesis@gmail.com');
    return conv.scene.next.name = "actions.scene.END_CONVERSATION";
});

function identificandoChild(nombre,numero_usuarios,usuarios){
    let ide;
    let clave = 'usuario_';
    let clave_id;
    let usuario;
    let nombre_usuario;
    let child;
    let child_id;
    
    for (let id = 1; id < (numero_usuarios + 1); id++) {
        ide = String(id);
        clave_id = clave + ide; 
        usuario = usuarios[clave_id];
        nombre_usuario = usuario['name'];
        if (nombre_usuario == nombre) {
            child = 'users/';
            child_id = child + clave_id;
            return child_id;
        }
    }
}

app.handle('resultado_pidiendo_contrasena', async conv => {
    conv.session.params.actuador = '';
    let nombre = conv.user.params.Name;
    let numero_usuarios = await numUser(db);
    let usuarios = await user(db);
    let child_id = identificandoChild(nombre,numero_usuarios,usuarios);

    await updatePassword(ref,'',child_id);
    await updateConsultar(ref,'',child_id);

    return conv.add('Ingresa tu contraseña por favor: ');
});

app.handle('resultado_password', async conv => {

    let nombre = conv.user.params.Name;
    let password = conv.scene.slots.OpcionNumero.value;
    let aut_json = {"usuario": nombre,"contrasena": password};
    let aut_string = JSON.stringify(aut_json);
    let numero_usuarios = await numUser(db);
    let usuarios = await user(db);
    let child_id = identificandoChild(nombre,numero_usuarios,usuarios);

    await updatePassword(ref,aut_string,child_id);

    let child_ide = '/' + child_id + '/consultar';
    let consultar = await getDato(db,child_ide);
        if (consultar == ''){
            for (let count = 0; count < 20; count ++) {
                consultar = await getDato(db,child_ide);
                if (consultar != ''){
                    switch (consultar) {
                        case false:
                            conv.add('Contraseña incorrecta' + nombre + '. Intente nuevamente mas tarde.');    
                            await updatePassword(ref,'',child_id);
                            await updateConsultar(ref,'',child_id);
                            return conv.scene.next.name = "actions.scene.END_CONVERSATION";   
                        case true:
                            conv.add('Autentificación exitosa ' + nombre + '. ');
                            await updatePassword(ref,'',child_id);
                            await updateConsultar(ref,'',child_id);
                            return conv.scene.next.name = "Empezar";
                        default:
                            conv.add('Error de autentificacion intenta nuevamente mas tarde');
                            return conv.scene.next.name = "actions.scene.END_CONVERSATION";   
                    }              
                }
                else{
                    if (count >= 15){
                        conv.add('Lo siento no pudimos establecer una conexión con el servidor. Verifica la conexión del servicio de internet y/o la alimentación del rack de control.');
                        await updatePassword(ref,'',child_id);
                        await updateConsultar(ref,'',child_id);
                        await sleep(1000);
                        return conv.scene.next.name = "actions.scene.END_CONVERSATION";
                    }
                    await sleep(500);
                }
            }
        }
        else{
            conv.add('Lo siento sucedio un error durante la autentificación. Intente nuevamente por favor');
            return conv.scene.next.name = "actions.scene.END_CONVERSATION";
        }  
});

app.handle('resultado_borrar_storage', async conv => {
    let nombre = conv.user.params.Name;
    let numero_usuarios = await numUser(db);
    let usuarios = await user(db);
    let child_id = identificandoChild(nombre,numero_usuarios,usuarios);
    await updatePassword(ref,'',child_id);
    await updateConsultar(ref,'',child_id);
    conv.user.params.Consultar = '';
    conv.user.params.Name = '';
    conv.add('Datos borrados.');
    return conv.scene.next.name = "actions.scene.END_CONVERSATION";
});

/////////////////////////////////////////////////////////////////// ACTUADOR Y TAREA //////////////////////////////////////////////////////////////

async function ActuadorPuerta(conv, accion, actuador) {
    let respuesta_abrir = 'Abriendo puerta!. ';
    let respuesta_cerrar = 'Cerrando puerta!. ';
    let respuesta_encender = 'Estimado la sirena es un actuador muy delicado y llamativo. Encenderlo no sería una acción muy prudente, lo siento no puedo ayudarte con ello. ';
    let respuesta_apagar = 'La sirena se disuadió exitosamente!. ';
    let respuesta_falla = 'Lo siento. No se pudo ejecutar ninguna acción, revisa las opciones disponibles para la ejecución de tareas o tu ortografía por favor!. ';
    let respuesta_encender_lucesjardin = 'Encendiendo Luces del Jardín.'
    let respuesta_apagar_lucesjardin = 'Apagando Luces del Jardín.'
    let puerta = await datos(db,'puertaprincipal','chapa');
    let puerta_contacto =await datos(db,'puertaprincipal','contacto_c');
    let puerta_mov_uno = await datos(db,'puertaprincipal','contacto_m');
    let puerta_mov_dos = await datos(db,'puertaprincipal','contacto_m_dos');
    let sirena_estado = await datos(db,'jardin/actuadores','sirena');
    let perimetro_automatic = await datos(db,'jardin/actuadores','automaticosirena');
    let lucesDelJardin_estado = await datos(db,'jardin/actuadores','lucesjardin');
    let mensaje = '';
    //Actuador Puerta
    if ((accion == "abrir") && (actuador == "puerta")) {
        if ((puerta_contacto == true)) {
            let nombre = conv.user.params.Name;
            await updatePuertaNombre(ref, nombre);
            await updatePuertaChapa(ref, "abrir");
            mensaje = respuesta_abrir;
        } 
        else {
            mensaje = 'La puerta ya se encuentra abierta. ';
        }
    }
    else if ((accion == "cerrar") && (actuador == "puerta")) {
        if ((puerta_contacto == false)) {
            if ((puerta_mov_uno == true) && (puerta_mov_dos == true)) {
                let nombre = conv.user.params.Name;
                await updatePuertaNombre(ref, nombre);
                await updatePuertaChapa(ref, "cerrar");
                mensaje = respuesta_cerrar;
            }
            else {
                mensaje = 'Se detecto movimiento cerca a la puerta, su petición no pudo ser ejecutada. Intente nuevamente más tarde o habilite el modo automático para el control de la puerta.';
            }
        }
        else {
            mensaje = 'La puerta ya está cerrada. ';
        }
    }
    //Actuador Sirena
    else if ((accion == "apagar") && (actuador == "sirena")) {
        if (sirena_estado == false){
            mensaje = 'La sirena ya se encuentra apagada.';
        }
        else{
            await updatePerimetroSirena(ref, false);
            let nombre = conv.user.params.Name;
            await updatePerimetroNombre(ref, nombre);
            mensaje = respuesta_apagar;
        }
    }
    else if ((accion == "encender") && (actuador == "sirena")) {
        if (perimetro_automatic == true){
            if (sirena_estado == true){
                mensaje = 'La sirena se encuentra encendida.';
            }
            else{
                mensaje = respuesta_encender;
            }
        }
        else{
            mensaje = 'Para poder iniciar con las pruebas de la alarma perimetral, debes de activar el "modo automático" para el sensor perimetral.';
        }  
    }
    //Actuador Luces del jardin
    else if ((accion == "apagar") && (actuador == "luces jardin")) {
        if (lucesDelJardin_estado == false){
            mensaje = 'La luz del jardín ya se encuentra apagada.';
        }
        else{
            await updateLucesJardin(ref, false);
            let nombre = conv.user.params.Name;
            await updateNombreLucesJardin(ref, nombre);
            mensaje = respuesta_apagar_lucesjardin;
        }
    }
    else if ((accion == "encender") && (actuador == "luces jardin")) {
        if (lucesDelJardin_estado == true){
            mensaje = 'La luz del jardín ya se encuentra encendida.';
        }
        else{
            await updateLucesJardin(ref, true);
            let nombre = conv.user.params.Name;
            await updateNombreLucesJardin(ref, nombre);
            mensaje = respuesta_encender_lucesjardin;
        }  
    }
    //Respuesta por defecto
    else {
        mensaje = respuesta_falla;
    }
    conv.add(mensaje);
}

//////////////////////////////////////////////////////////////////// INFORMACION ///////////////////////////////////////////////////

async function Informacion(conv,zona) {
    //HABITACION PRINCIPAL
    let balconHabitacionPrincipal = await datos(db,'habitacionprincipal/sensores','balconhabitacionprincipal');
    let dateBalconHabitacionPrincipal = await datos(db,'habitacionprincipal/sensores','datebalconhabitacionprincipal');
    let puertaHabitacionPrincipal = await datos(db,'habitacionprincipal/sensores','puertahabitacionprincipal');
    let datePuertaHabitacionPrincipal = await datos(db,'habitacionprincipal/sensores','datepuertahabitacionprincipal');
    //TIENDA
    let puertaGaraje = await datos(db,'tienda/sensores','puertagaraje');
    let datePuertaGaraje = await datos(db,'tienda/sensores','datepuertagaraje');
    let ventanaTienda = await datos(db,'tienda/sensores','ventanatienda');
    let dateVentanaTienda = await datos(db,'tienda/sensores','dateventanatienda');
    let sensorMovimientoEntradaTienda = await datos(db,'tienda/sensores','sensormovimientoentradatienda');
    let dateSensorMovimientoEntradaTienda = await datos(db,'tienda/sensores','datesensormovimientoentradatienda');
    //JARDIN
    let puerta_contacto =  await datos(db,'puertaprincipal','contacto_c');
    let puerta_contacto_h = await datos(db,'puertaprincipal','h_puerta_contacto_c');
    let puerta_movimiento_uno = await datos(db,'puertaprincipal','contacto_m');
    let puerta_movimiento_uno_h = await datos(db,'puertaprincipal','h_puerta_contacto_m');
    let puerta_movimiento_dos = await datos(db,'puertaprincipal','contacto_m_dos');
    let puerta_movimiento_dos_h = await datos(db,'puertaprincipal','h_puerta_contacto_m_dos');
    let datelucesjardin = await datos(db,'jardin/actuadores','datelucesjardin');
    let lucesJardin = await datos(db,'jardin/actuadores','lucesjardin');
    //PERIMETRO
    let perimetroPrincipal = await datos(db,'jardin/sensores','perimetroprincipal');
    let datePerimetroPrincipal = await datos(db,'jardin/sensores','dateperimetroprincipal');
    let mensaje = '';

    switch (zona) {
        //Habitacion principal
        case "habitacion principal":
            let mensaje_hp_1 = '';
            let mensaje_hp_2 = '';
            switch (balconHabitacionPrincipal) {
                case false:
                    mensaje_hp_1 = 'La puerta del balcón de la habitación principal se encuentra abierta desde el ' + dateBalconHabitacionPrincipal ; 
                    break;
                case true:
                    mensaje_hp_1 = 'La puerta del balcón de la habitación principal se encuentra cerrada desde el ' + datePuertaHabitacionPrincipal ;
                    break;
            }
            switch (puertaHabitacionPrincipal) {
                case false:
                    mensaje_hp_2 = 'y la puerta de la habitación principal se encuentra abierta desde el ' + dateBalconHabitacionPrincipal + '. '; 
                    break;
                case true:
                    mensaje_hp_2 = 'y la puerta de la habitación principal se encuentra cerrada desde el  ' + datePuertaHabitacionPrincipal + '. ';   
                    break;
            }
            mensaje = mensaje_hp_1 +  mensaje_hp_2;
            conv.add(mensaje);
            break;
        //Tienda
        case "tienda":
            let mensaje_tienda_1 = '';
            let mensaje_tienda_2 = '';
            let mensaje_tienda_3 = '';

            switch (puertaGaraje) {
                case true:
                    mensaje_tienda_1 = 'En la tienda la puerta del garaje se encuentra cerrada desde el ' + datePuertaGaraje; 
                    break;
                case false:
                    mensaje_tienda_1 = 'En la tienda la puerta del garaje se encuentra abierta desde el ' + datePuertaGaraje; 
                    break;
            }
            switch (ventanaTienda) {
                case true:
                    mensaje_tienda_2 = ', la ventana se encuentra cerrada desde el ' + dateVentanaTienda;
                    break;
                case false:
                    mensaje_tienda_2 = ', la ventana se encuentra abierta desde el ' + dateVentanaTienda;
                    break;
            }
            switch (sensorMovimientoEntradaTienda) {
                case true:
                    mensaje_tienda_3 = ' y no se detectó movimiento en la zona desde el ' + dateSensorMovimientoEntradaTienda + '.';
                    break;
                case false:
                    mensaje_tienda_3 = ' y actualmente se detecta movimiento en la zona.';
                    break;
            }
            mensaje = mensaje_tienda_1 + mensaje_tienda_2 + mensaje_tienda_3;
            conv.add(mensaje);
            break;

        case "jardin":
            let mensaje_jardin_1 = '';
            let mensaje_jardin_2 = '';
            let mensaje_jardin_3 = '';

            switch (perimetroPrincipal) {
                case false:
                    mensaje_jardin_1 = 'Se detecta movimiento en el perimetro en la zona del jardín, ';
                    break;
                case true:
                    mensaje_jardin_1 = 'No se detecta movimiento en el perimetro en la zona del jardín, desde el ' + datePerimetroPrincipal + ', ';
                    break;
            }
            switch (puerta_contacto) {
                case false:
                    mensaje_jardin_2 = 'la puerta principal se encuentra abierta desde el ' + puerta_contacto_h ;
                    break;
                case true:
                    mensaje_jardin_2 = 'La puerta principal se encuentra cerrada desde el ' + puerta_contacto_h ;
                    break;
            }
            switch (lucesJardin) {
                case true:
                    mensaje_jardin_3 = ' y las luces del jardín se encuentran encendidas. ';
                    break;
                case false:
                    mensaje_jardin_3 = ' y las luces del jardín se encuentran apagadas desde el ' + datelucesjardin + '. ';
                    break;
            }

            mensaje = mensaje_jardin_1 + mensaje_jardin_2 + mensaje_jardin_3;
            conv.add(mensaje);
            break;

        case "puerta":
            let mensaje_puerta_1 = '';
            let mensaje_puerta_2 = '';
            let mensaje_puerta_3 = '';

            switch (puerta_contacto) {
                case false:
                    mensaje_puerta_1 = 'La puerta principal se encuentra abierta desde el ' + puerta_contacto_h + '. ';
                    break;
                case true:
                    mensaje_puerta_1 = 'La puerta principal se encuentra cerrada desde el ' + puerta_contacto_h + '. ';
                    break;
            }
            switch (puerta_movimiento_uno) {
                case false:
                    mensaje_puerta_2 = 'Así también, se detectó movimiento delante de la puerta principal y ';
                    break;
                case true:
                    mensaje_puerta_2 = 'Así también, no se detectó movimiento detrás de la puerta principal desde el ' + puerta_movimiento_uno_h + ' y ';
                    break;
            }
            switch (puerta_movimiento_dos) {
                case false:
                    mensaje_puerta_3 = 'se detectó movimiento detrás de la puerta principal.';
                    break;
                case true:
                    mensaje_puerta_3 = 'no se detectó movimiento detrás de la puerta principal desde el ' + puerta_movimiento_dos_h + '. '; 
                    break;
            }
            mensaje = mensaje_puerta_1 + mensaje_puerta_2 + mensaje_puerta_3;
            conv.add(mensaje);
            break;

        case "muro":
            let mensaje_perimetro = '';
            switch (perimetroPrincipal) {
                case false:
                    mensaje_perimetro = 'Actualmente se detectó movimiento en la zona del muro.';
                    break;
                case true:
                    mensaje_perimetro = 'No se detectó movimiento en la zona del muro desde el ' + datePerimetroPrincipal + '. ';
                    break;
            }
            mensaje = mensaje_perimetro;
            conv.add(mensaje);
            break;

        case "sensores":
            let mensaje_resultado = '';
            let mensaje_resultado_1 = '';
            let mensaje_resultado_2 = '';
            let mensaje_resultado_3 = '';

            if (( balconHabitacionPrincipal == false) || (puertaGaraje == false) || (ventanaTienda == false) || (puerta_contacto == false)) {
                let cont = 0;
                let b_contacto = '';
                let g_contacto = '';
                let v_contacto = '';
                let p_contacto = '';
                if (balconHabitacionPrincipal == false) { b_contacto = 'el balcón, '; cont = cont + 1; }
                if (puertaGaraje == false) { g_contacto = 'el garaje, '; cont = cont + 1; }
                if (ventanaTienda == false) { v_contacto = 'la ventana, '; cont = cont + 1; }
                if (puerta_contacto == false) { p_contacto = 'la puerta '; cont = cont + 1; }
                if (cont >= 2) { mensaje_resultado = ' Actualmente las secciones de ' + b_contacto + g_contacto + v_contacto + p_contacto + ' presentan entradas abiertas.'; }
                else if (cont == 1) { mensaje_resultado = ' Actualmente la sección de ' + b_contacto + g_contacto + v_contacto + p_contacto + ' presenta su entrada abierta.'; }
            }

            if ((sensorMovimientoEntradaTienda == false) || (puerta_movimiento_uno == false) || (puerta_movimiento_dos == false) || (perimetroPrincipal == false)) {
                let cont = 0;
                let tien_movimiento = '';
                let p_movimiento_uno = '';
                let p_movimiento_dos = '';
                let per_movimiento = '';

                if (sensorMovimientoEntradaTienda == false) { tien_movimiento = 'la entrada de la tienda ,'; cont = cont + 1; }
                if (puerta_movimiento_uno == false) { p_movimiento_uno = 'delante de la puerta , '; cont = cont + 1; }
                if (puerta_movimiento_dos == false) { p_movimiento_dos = 'detrás de la puerta , '; cont = cont + 1; }
                if (perimetroPrincipal == false) { per_movimiento = 'el muro'; cont = cont + 1; }

                if (cont >= 2) { mensaje_resultado_1 = ' Actualmente existe movimiento en las siguientes zonas: ' + tien_movimiento + p_movimiento_dos + p_movimiento_uno + per_movimiento + '. '; }
                else if (cont == 1) { mensaje_resultado_1 = ' Actualmente ' + tien_movimiento + p_movimiento_uno + p_movimiento_dos + per_movimiento + ' se detecta movimiento.'; }
            }

            if ((sensorMovimientoEntradaTienda == true) && (puerta_movimiento_uno == true) && (puerta_movimiento_dos == true) && (perimetroPrincipal == true)) {
                mensaje_resultado_2 = ' Ninguna de las zonas de la casa presenta movimiento.';
                if ((balconHabitacionPrincipal == true) && (puertaGaraje == true) && (puerta_contacto == true)) {
                    mensaje_resultado_2 = 'Todos los accesos de apertura se encuentran cerrados y no se detectó movimiento en toda la casa. ';
                }
                else if ((balconHabitacionPrincipal == false) && (puertaGaraje == false) && (puerta_contacto == false)){
                    mensaje_resultado_2 = 'Todos los accesos de apertura se encuentran abiertos y no se detectó movimiento en toda la casa. ';
                }
            }

            if ((balconHabitacionPrincipal == true) && (puertaGaraje == true) && (puerta_contacto == true)) {
                mensaje_resultado_3 = ' Todas las entradas se encuentran cerradas.';
                if ((sensorMovimientoEntradaTienda == true) && (puerta_movimiento_uno == true) && (puerta_movimiento_dos == true) && (perimetroPrincipal == true)) {
                    mensaje_resultado_3 = ' Todas las entradas se encuentran cerradas y no se detectó movimiento en toda la casa. ';
                }
                else if ((sensorMovimientoEntradaTienda == false) && (puerta_movimiento_uno == false) && (puerta_movimiento_dos == false) && (perimetroPrincipal == false)) {
                    mensaje_resultado_3 = ' Todas las entradas se encuentran cerradas y existe movimiento en toda la casa. ';
                }
            }

            mensaje = mensaje_resultado + mensaje_resultado_1 + mensaje_resultado_2 + mensaje_resultado_3;
            return conv.add(mensaje);

        default:
            mensaje = 'Lo siento. No puedo informarte sobre ese espacio, revisa las opciones disponibles para la informacion o tu ortografía por favor!.';
            return conv.add(mensaje);
    } 
}

/////////////////////////////////////////////////////////////////// PUERTA AUTOMATICA //////////////////////////////////////////////////////////////

async function AutomaticoPuerta(conv, modo_puerta, opcion_actuador) {
    let mensaje_automatico = 'Se habilitó el modo puerta automática.';
    let mensaje_no_automatico = 'Se habilitó el modo puerta manual.';
    let mensaje_falla = 'Lo siento no tengo esa opción disponible. Por favor revisa las opciones nuevamente y repíteme la petición.';
    let estado_automatico = await datos(db,'puertaprincipal','automatic');
    if ((modo_puerta == "manual") && (opcion_actuador == "puerta")) {
        if (estado_automatico == false) {
            conv.add('El modo puerta manual, ya esta habilitado. ');
        }
        else if (estado_automatico == true) {
            await updatePuertaAutomatic(ref, false);
            conv.add(mensaje_no_automatico);
        }
    }
    else if ((modo_puerta == "automatico") && (opcion_actuador == "puerta")) {
        if (estado_automatico == true) {
            conv.add('El modo puerta automática, ya se encuentra habilitado.');
        }
        else if (estado_automatico == false) {
            await updatePuertaAutomatic(ref, true);
            conv.add(mensaje_automatico);
        }
    }
    else {
        conv.add(mensaje_falla);
    }
}

/////////////////////////////////////////////////////////////////// SIRENA AUTOMATICA //////////////////////////////////////////////////////////////

async function AutomaticoSirena(conv, modo_sirena, opcion_actuador) {
    let mensaje_automatico = 'Se habilitó el modo sirena automática.';
    let mensaje_no_automatico = 'Se habilitó el modo sirena manual.';
    let mensaje_falla = 'Lo siento no tengo esa opción disponible. Por favor revisa las opciones nuevamente y repíteme la petición.';
    let estado_automatico = await datos(db,'jardin/actuadores','automaticosirena');
    if ((modo_sirena == "manual") && (opcion_actuador == "sirena")) {
        if (estado_automatico == false) {
            conv.add('El modo sirena no automática, ya esta habilitado. ');
        }
        else if (estado_automatico == true) {
            await updatePerimetroAutomatic(ref, false);
            conv.add(mensaje_no_automatico);
        }
    }
    else if ((modo_sirena == "automatico") && (opcion_actuador == "sirena")) {
        if (estado_automatico == true) {
            conv.add('El modo sirena automática, ya se encuentra habilitado.');
        }
        else if (estado_automatico == false) {
            await updatePerimetroAutomatic(ref, true);
            conv.add(mensaje_automatico);
        }
    }
    else {
        conv.add(mensaje_falla);
    }
}

/////////////////////////////////////////////////////////// LUZ JARDIN AUTOMATICO ////////////////////////////////////////////////////

async function AutomaticoLucesJardin(conv, modo_luz_jardin, opcion_actuador) {
    let mensaje_automatico = 'Se habilitó el modo luz del jardín automático.';
    let mensaje_no_automatico = 'Se habilitó el modo luz del jardín manual.';
    let mensaje_falla = 'Lo siento no tengo esa opción disponible. Por favor revisa las opciones nuevamente y repíteme la petición.';
    let estado_automatico = await datos(db,'jardin/actuadores','automaticolucesjardin');
    if ((modo_luz_jardin == "manual") && (opcion_actuador == "luces jardin")) {
        if (estado_automatico == false) {
            conv.add('El modo luz del jardín manual, ya se encuentra habilitado. ');
        }
        else if (estado_automatico == true) {
            await updateLucesJardinAutomatic(ref, false);
            conv.add(mensaje_no_automatico);
        }
    }
    else if ((modo_luz_jardin == "automatico") && (opcion_actuador == "luces jardin")) {
        if (estado_automatico == true) {
            conv.add('El modo luz del jardín automático, ya se encuentra habilitado. ');
        }
        else if (estado_automatico == false) {
            await updateLucesJardinAutomatic(ref, true);
            conv.add(mensaje_automatico);
        }
    }
    else {
        conv.add(mensaje_falla);
    }
}

/////////////////////////////////////////////////////////// MODOS DE SEGURIDAD ///////////////////////////////////////////////////

async function Modos(conv, modo) {
    let respuesta_armar = 'La casa ahora se encuentra bajo mi resguardo. Ve con cuidado y vuelve pronto!!';
    let respuesta_desarmar = 'La casa ya se encuentra habitada.. que bueno. Bienvenido!. La casa ya esta a salvo!';
    let respuesta_falla = 'Lo siento. No se pudo habilitar el modo requerido, revisa las opciones disponibles para los modos o tu ortografía por favor!.';
    let estado_modo = await datos(db,'modo','modo');

    if ((modo == "armado") || (modo == "deshabitado") || (modo == "vacaciones")) {
        if (estado_modo == "deshabitado") {
            conv.add('El modo armado ya se encuentra habilitado. ');
            return conv.scene.next.name = "Again_Modos";
        }
        else if (estado_modo == "habitado") {
            await updateModoModo(ref, "deshabitado");
            conv.add(respuesta_armar);
            return conv.scene.next.name = "Again_Modos";
        }
    }
    else if ((modo == "habitado") || (modo == "desarmado")) {
        if (estado_modo == "habitado") {
            conv.add('El modo desarmado ya se encuentra habilitado. ');
            return conv.scene.next.name = "Again_Modos";
        }
        else if (estado_modo == "deshabitado") {
            await updateModoModo(ref, "habitado");
            conv.add(respuesta_desarmar);
            return conv.scene.next.name = "Again_Modos";
        }
    }
    else {
        conv.add(respuesta_falla);
        return conv.scene.next.name = "Again_Modos";
    }
}

///////////////////////////////////////////////////SECCION DE GESTION DE RESPUESTAS DE TAREAS /////////////////////////////////////////////////////

app.handle('resultado_solo_tarea', conv => {
    let tareita = conv.intent.params.OpcionTarea.resolved;
    let respuesta_tareita = 'Ok, quisiera que me digas sobre que sensor debo ejecutar dicha acción!. ';
    let respuesta_falla = 'Lo siento. No se pudo ejecutar ninguna acción, revisa las opciones disponibles para la ejecución de tareas o tu ortografía por favor!. ';
    let mensaje = '';

    if (tareita == "cerrar") {
        mensaje = respuesta_tareita;
        conv.session.params.OpcionTarea = tareita;
    }
    else if (tareita == "abrir") {
        mensaje = respuesta_tareita;
        conv.session.params.OpcionTarea = tareita;
    }
    else {
        mensaje = respuesta_falla;
    }
    conv.add(mensaje);
});

app.handle('resultado_solo_actuador', conv => {
    let actuadorcito = conv.intent.params.OpcionSensor.resolved;
    let respuesta_actuadorcito = 'Bien, quisiera que me digas que acción debo realizar sobre dicho sensor. ';
    let respuesta_falla = 'Lo siento. No se pudo ejecutar ninguna acción, revisa las opciones disponibles para la ejecución de tareas o tu ortografía por favor!.';
    let mensaje;

    if (actuadorcito == "puerta") {
        mensaje = respuesta_actuadorcito;
        conv.session.params.OpcionSensor = actuadorcito;
    }
    else {
        mensaje = respuesta_falla;
    }
    conv.add(mensaje);
});

app.handle('resultado_condicion_actuador_tarea', conv => {
    let tarea = conv.scene.slots.OpcionTarea.updated;
    let sensor = conv.scene.slots.OpcionSensor.updated;
    let tarea_value = conv.scene.slots.OpcionTarea.value;
    let sensor_value = conv.scene.slots.OpcionSensor.value;
    let respuesta_sin_actuador = 'Ok, dime sobre qué actuador debo realizar dicha acción?. ';
    let respuesta_sin_accion = 'Dime qué acción debo realizar sobre dicho elemento.';
    let respuesta_falla = 'Lo siento. No se pudo ejecutar ninguna acción, revisa nuevamente las opciones disponibles o tu ortografía por favor!.';

    if ((tarea == true) && (sensor == false)) {
        let sensorcito = conv.session.params.OpcionTarea;
        if ((tarea_value == "cerrar") && (sensor_value == "puerta")) {
            ActuadorPuerta(conv, tarea_value, sensor_value);
        }
        else if ((tarea_value == "abrir") && (sensor_value == "puerta")) {
            ActuadorPuerta(conv, tarea_value, sensor_value);
        }
        else if (((tarea_value == "abrir") || (tarea_value == "cerrar")) && (sensorcito == "puerta")) {
            if (tarea_value == "abrir") {
                ActuadorPuerta(conv, tarea_value, sensorcito);
                conv.session.params.OpcionTarea = tarea_value;
            }
            else if (tarea_value == "cerrar") {
                ActuadorPuerta(conv, tarea_value, sensorcito);
                conv.session.params.OpcionSensor = tarea_value;
            }
        }
        else if ((tarea_value == "abrir") || (tarea_value == "cerrar")) {
            conv.add(respuesta_sin_actuador);
        }
    }

    else if ((sensor == true) && (tarea == false)) {
        let tareita = conv.session.params.OpcionTarea;
        if ((tarea_value == "cerrar") && (sensor_value == "puerta")) {
            ActuadorPuerta(conv, tarea_value, sensor_value);
        }
        else if ((tarea_value == "abrir") && (sensor_value == "puerta")) {
            ActuadorPuerta(conv, tarea_value, sensor_value);
        }
        else if ((sensor_value == "puerta") && ((tareita == "abrir") || (tareita == "cerrar"))) {
            if (tareita == "abrir") {
                ActuadorPuerta(conv, tareita, sensor_value);
                conv.session.params.OpcionSensor = sensor_value;
            }
            else if (tareita == "cerrar") {
                ActuadorPuerta(conv, tareita, sensor_value);
                conv.session.params.OpcionSensor = sensor_value;
            }
        }
        else if (sensor_value == "puerta") {
            conv.add(respuesta_sin_accion);
        }
    }
    else if ((sensor == true) && (tarea == true)) {
        if ((tarea_value == "cerrar") && (sensor_value == "puerta")) {
            ActuadorPuerta(conv, tarea_value, sensor_value);
        }
        else if ((tarea_value == "abrir") && (sensor_value == "puerta")) {
            ActuadorPuerta(conv, tarea_value, sensor_value);
        }
    }
    else {
        conv.add(respuesta_falla);
    }

});

app.handle('resultado_again_tareas', conv => {
    let respuesta = conv.intent.params.SiAgain;
    if (respuesta != '') {
        conv.session.params.OpcionSensor = '';
        conv.session.params.OpcionTarea = '';
        conv.add('Okey. ');
    }
});

app.handle('resultado_actuador_tarea_dos', async conv => {
    let accion = conv.intent.params.OpcionTarea.resolved;
    let actuador = conv.intent.params.OpcionSensor.resolved;
    await ActuadorPuerta(conv, accion, actuador);
});

app.handle('resultado_control_sirena', async conv => {
    let orden = conv.intent.params.TareaSirena.resolved;
    let elemento = conv.intent.params.SensorSirena.resolved;
    await ActuadorPuerta(conv, orden, elemento);
});

app.handle('resultado_control_luces_jardin', async conv => {
    let orden = conv.intent.params.TareaLucesJardin.resolved;
    let elemento = conv.intent.params.SensorLucesJardin.resolved;
    await ActuadorPuerta(conv, orden, elemento);
});

////////////////////////////////////////////////////// SECCION DE GESTION RESPUESTAS PUERTA AUTOMATICA //////////////////////////////////////////////////////////////

app.handle('resultado_puerta_automatica', async conv => {
    let modo_puerta = conv.intent.params.OpcionPuertaAutomatica.resolved;
    let opcion_actuador = conv.intent.params.OpcionSensorPuertaAutomatica.resolved;
    await AutomaticoPuerta(conv, modo_puerta, opcion_actuador);
});

////////////////////////////////////////////////////// SECCION DE GESTION RESPUESTAS SIRENA AUTOMATICA //////////////////////////////////////////////////////////////

app.handle('resultado_sirena_automatica', async conv => {
    let modo_sirena = conv.intent.params.OpcionSirenaAutomatica.resolved;
    let opcion_actuador = conv.intent.params.OpcionSensorSirenaAutomatica.resolved;
    await AutomaticoSirena(conv, modo_sirena, opcion_actuador);
});

////////////////////////////////////////////////////// SECCION DE GESTION RESPUESTAS LUCES JARDIN AUTOMATIC0 //////////////////////////////////////////////////////////////

app.handle('resultado_luces_jardin_automatica', async conv => {
    let modo_luces_jardin = conv.intent.params.OpcionLucesJardinAutomatico.resolved;
    let opcion_actuador = conv.intent.params.OpcionSensorLucesJardinAutomatico.resolved;
    await AutomaticoLucesJardin(conv, modo_luces_jardin, opcion_actuador);
});

////////////////////////////////////////////////////// SECCION DE GESTION DE HORARIOS LUCES JARDIN AUTOMATIC0 //////////////////////////////////////////////////////////////

app.handle('resultado_opciones_horas_seleccion', async conv => {
    let actuador = conv.intent.params.OpcionesHorariosSeleccion.resolved;
    conv.session.params.actuador = actuador
    if ((actuador == 'luces jardin') || (actuador == 'modo')){
        conv.add('Ok. Introduce el horario de activación automática, segun el formato establecido. Por ejemplo "19:30 a 23:30", respetando la simbología y los espacios.')
        return conv.scene.next.name = "Entrando_Horarios_Dos";
    }
    else{
        conv.add('Lo siento ese elemento no se encuentra entre las opciones de tipo "Automáticos".');
        return conv.scene.next.name = "Entrando_Horarios";      
    }
});

app.handle('resultado_opciones_horas', async conv => {
    let hora_uno = conv.intent.params.horaAutomaticoUno.original;
    let hora_dos = conv.intent.params.horaAutomaticoDos.original;
    let datoActuador = conv.session.params.actuador;
    
    if (( hora_uno.length >= 4 ) || ( hora_dos.length >= 4 )) {
        if (datoActuador == 'luces jardin') {
            if (hora_uno.length == 4){
                hora_uno = "0" + hora_uno;
            }
            if (hora_dos.length == 4){
                hora_dos = "0" + hora_dos;
            }
            await updateLucesJardinHoraUno(ref,hora_uno);
            await updateLucesJardinHoraDos(ref,hora_dos);
            conv.add('Reajuste de horario exitoso. El horario de activación automática de las Luces del Jardín inicia a las: ' + hora_uno + ' y finaliza a las ' + hora_dos + '.');
            conv.scene.next.name = "Again_Horarios";
        }
        else if (datoActuador == 'modo') {
            if (hora_uno.length == 4){
                hora_uno = "0" + hora_uno;
            }
            if (hora_dos.length == 4){
                hora_dos = "0" + hora_dos;
            }
            await updateModosArmadoHoraUno(ref,hora_uno);
            await updateModosArmadoHoraDos(ref,hora_dos);
            conv.add('Reajuste de horario exitoso. El horario de activación automática de los modos de seguridad inicia a las: ' + hora_uno + ' y finaliza a las ' + hora_dos + '.');
            conv.scene.next.name = "Again_Horarios";
        }
        else{
            conv.add('Reajuste de horario fallido. Revisa nuevamente los datos ingresados e intenta nuevamente más tarde.');
            return conv.scene.next.name = "actions.scene.END_CONVERSATION";
        }
    }
    else if (( hora_uno.length > 5 ) || ( hora_dos.length > 5 )){
        conv.add('Reajuste de horario fallido. Porfavor revisa nuevamente el formato con el cual ingresaste los datos o intentalo nuevamente más tarde.');
        return conv.scene.next.name = "actions.scene.END_CONVERSATION";
    }
    
});

app.handle('resultado_opciones_horas_seleccion_directo', async conv => {
    let horario = conv.intent.params.OpcionesHorariosCapacidades.resolved;
    let actuador = conv.intent.params.OpcionesHorariosSeleccionHorariosElemento.resolved;

    if ((horario == 'Horario') && (actuador == 'modo')) {
        conv.session.params.actuador = actuador
        conv.add('Ok. Introduce el horario de activación automática, segun el formato establecido. Por ejemplo "19:30 a 23:30", respetando la simbología y los espacios.')
        return conv.scene.next.name = "Entrando_Horarios_Dos";
    }
    else if ((horario == 'Horario') && (actuador == 'luces jardin')) {
        conv.session.params.actuador = actuador
        conv.add('Ok. Introduce el horario de activación automática, segun el formato establecido. Por ejemplo "19:30 a 23:30", respetando la simbología y los espacios.')
        return conv.scene.next.name = "Entrando_Horarios_Dos";
    }
    else{
        conv.add('Disculpa no puedo comprenderte, intentalo nuevamente. ');
        return conv.scene.next.name = "Again_Horarios";
    }
});

///////////////////////////////////////////////////// SECCION DE GESTION RESPUESTAS MANEJO DE LOS MODOS DE SEGURIDAD ///////////////////////////////////////////////////
app.handle('respuesta_entrando_modo', async conv => {
    let estado_modo = await datos(db,'modo','modo');
    let mensaje = '';
    if(estado_modo == 'habitado'){
        mensaje = 'Actualmente se encuentra habilitado el modo "Casa Desarmada".';
    }
    else if(estado_modo == 'deshabitado'){
        mensaje = 'Actualmente se encuentra habilitado el modo "Casa Armada".';
    }
    return conv.add(
        new Simple({
            speech: 'Ok. Dime qué ajustes realizaremos en los modos de seguridad de tu hogar?. ' + mensaje + ' Debajo te dejo algunas opciones para empezar a configurar.',
            text: 'Ok. Dime qué ajustes realizaremos en los modos de seguridad de tu hogar?. ' + mensaje + ' Debajo te dejo algunas opciones para empezar a configurar. 👇'
        })
    );
});

app.handle('resultado_opciones_modo', async conv => {
    let modo = conv.intent.params.seleccionModoElegido.resolved;
    await Modos(conv, modo);
});

///////////////////////////////////////////////////// SECCION DE GESTION MANEJO DE LA INFORMACION DE LA CASA ///////////////////////////////////////////////////////////

app.handle('resultado_bienvenido_informacion', conv => {
    return conv.add(
        new Simple({
            speech: 'Ok. Dime el nombre de la sección sobre la cuál deseas informarte.',
            text: 'Dime el nombre de la sección sobre la cuál deseas informarte. 👇'
        })
    );
});

app.handle('resultado_opciones_informacion', async conv => {
    const zona = conv.intent.params.sensorEspecificoOpcionesInformacion.resolved;
    await Informacion(conv, zona);
});

////////////////////////////// SECCION DE MANEJO DE SOLICITUD DE SOCORRO ///////////////////////////////////////////

app.handle('resultado_opcion_comida', async conv => {
    const comida = conv.intent.params.OpcionComida.resolved;
    const comida_contenido = conv.intent.params.OpcionComida.original;
    let estado_socorro = await datos(db,'socorro','socorro');
    let respuesta_cancelar = 'Perfecto, acabo de cancelar el pedido de ' + comida_contenido + '. Existe algo mas en lo que pueda ayudarte?';
    let respuesta_confirmar = 'Perfecto, acabo de confirmar el pedido de ' + comida_contenido + '. En unos minutos te paso la boleta electronica con todos los datos. Existe algo mas en lo que pueda ayudarte?';
    let respuesta_falla = 'Lo siento ese platillo no se encuentra dentro del menu de comidas favoritss. Repite nuevamente su nombre o revisa las opciones disponibles en la sección de Delivery Comida!.';
    let mensaje_socorro = '';
    let nombre_socorro = await conv.user.params.Name;

    if ((comida == "comida")) {
        let pedido = conv.intent.params.pedido_comida1.resolved;
        let estado_socorro = await datos(db,'socorro','socorro');       
        if (pedido == "platillo" || pedido == "pedido" || pedido == "comer" || pedido == "hambre") {
            mensaje_socorro = respuesta_confirmar;
            if(estado_socorro == false){
                await updateSocorroSocorro(ref, true);
                await updateSocorroNombre(ref, nombre_socorro);
            }
        }
        else if (pedido == "cancelar") {
            mensaje_socorro = respuesta_cancelar;
            if(estado_socorro == false){
                await updateSocorroSocorro(ref, true);
                await updateSocorroNombre(ref, nombre_socorro);
            }
        }
    }
    else if (comida == "socorro") {
        mensaje_socorro = new Simple({
            speech: 'Ok!',
            text: 'Ok ' + nombre_socorro,
        });
        if(estado_socorro == false){
            await updateSocorroSocorro(ref, true);
            await updateSocorroNombre(ref, nombre_socorro);;
        }
        conv.scene.next.name = "actions.scene.END_CONVERSATION";
    }
    else {
        mensaje_socorro = respuesta_falla;
    }
    conv.add(mensaje_socorro);
});

exports.ActionsGenesisFulfillment = functions.https.onRequest(app);
