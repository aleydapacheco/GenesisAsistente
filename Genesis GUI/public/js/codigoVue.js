
        let url = 'http://192.168.0.250:3000/';
        
        new Vue({
            
            el:"#app",
            vuetify: new Vuetify(),
                data(){
                    return{
                        //Variables para la edicion de HOME
                        cajonHome: true,
                        //Variables para la edicion de contrasena
                        nombreUsuarioCambioContrasena:'',
                        dialogCambiarContrasena: false,
                        nombreBotonCambiarContrasena: null,
                        cambioContrasena: {
                            nombre: '',
                            antiguaContrasena : '',
                            nuevaContrasena : '',
                            nuevaContrasenaDos : '',
                        },
                        cajonPerfilUsuario: false,
                        respuestaCambioContra: '',
                        //Variables para la transmision en vivo
                        dibujarTablaEnVivo: '',
                        link:'',
                        //Variables para la ADMIN. DE NUEVOS DISPOSITIVOS
                        dibujarTablaDispositivos: false,
                        dibujarBotonNuevaHabitacion: false,
                        dibujarBotonNuevoDispositivo: false,
                        dibujarTablaAdministracionHabitaciones: false,
                        nombreHabitacionAEditar: '',
                        nombreCardAccionHabitacion: '',
                        dispositivos: [],
                        dispositivoss: [],      
                        datoHabitaciones:[], 
                        dialogNuevoDispositivo: false,   
                        dialogNuevaHabitacion: false,
                        nuevasHabitaciones: [],
                        nuevasHabitacioness: [],
                        nuevaHabitacion: {
                            id: '',
                            nombre: '',
                        },
                        dispositivo: {
                            id: '',
                            nombre: '',
                            habitacion: '',
                            tipo: '',
                            icono: '',
                            fechaYhora: '',
                            tabla: '',
                            tipoEspecifico: '', 
                            pin: '', 
                        },
                        operacionHabitacionDispositivo: null,
                        accionHabitacionDispositivo: null,
                        nombreCardAccionDispositivo: null,
                        nombreDispositivoAEditar: null,
                        tipoDeDispositivo: ['Sensor apertura','Sensor movimiento','Sensor perimetral','Puerta','Actuador'],
                        tipoDeDispositivoValue: ['Sensor apertura','Sensor movimientor','Sensor perimetral','Puerta','Actuador'],
                        iconos: ['mdi-wall', 'mdi-door-open', 'mdi-coach-lamp', 'mdi-window-open-variant', 'mdi-motion-sensor', 'mdi-window-open-variant', 'mdi-alarm-light',
                            'mdi-lightbulb', 'mdi-motion-sensor',
                        ],
                        valorPines: [],
                        todosPines: [5,6,9,10,11,12,13,16,17,19,22,23,24,25,26,27],
                        pinesRestantes: [],
                        pinesRestantesGPIO: [],
                        mensajeDispositivo: null,
                        //Variables para dibujar el MENU LATERAL IZQUIERDO                       
                        dibujarMenu: true,
                        datos:[],
                        //Variables de LOS MENUS DE LAS TABLAS
                        dibujarMenuHome: true,
                        dibujarMenuHabitaciones: false,
                        dibujarMenuMultimedia: false,
                        dibujarMenuUsuarios: false,
                        dibujarMenuAccount: false,
                        dibujarMenuMultimediaUsuariosDispositivos: false,
                        dibujarMenuAdministracionHabitaciones: false,
                        //Variables para mostrar tablas de DATOS
                        dibujarTablaHabitaciones: false,
                        filtrarHeadersPorHabitacion:'',
                        filtrarHeadersPorDispositivoDeHabitacion:'',
                        mostrarCuerpoTablaIterableAlDispararSubmenu:'',
                        mostrarDatosTablaSegunTipoDeDispositivo:'',
                        //Variables para la TABLA SOCORRO
                        dibujarTablaSocorro: false,
                        socorros:[],
                        socorro:{
                            id:null,
                            modo:null,
                            medio: null,
                            usuario: null,
                            fechaYHora: null,                 
                        },
                        //Variables para la TABLA DE LA ADMIN. DE USUARIOS
                        dibujarTablaUsuarios: false,
                        dibujarBotonNuevoUsuario: false,
                        users: [],
                        dialog: false,
                        operacion: null,
                        name: null,
                        numUsuario: null,
                        nombreBoton: null,
                        accionFormulario: null,
                        accionFormularioDos: null,
                        mensaje: '',
                        usuario:{
                            id:'',
                            nombre:'',
                            usuario: '',
                            contrasena: '',
                            contrasenaDos: '',
                            rol: '',
                            fechaYHora: '',
                            login: '',
                            logout: '',
                            celular: '',
                        },
                        //Variables para la TABLA MULTIMEDIA
                        dibujarTablaMultimedia: false,
                        multimedias:[],
                        multimedia:{
                            id:null,
                            numero:null,
                            evento: null,
                            ruta: null,
                            tipoArchivo: null,
                            fechaYHora: null,                 
                        },
                        filtrarHeadersPorMultimediaYUsuarios:'',
                        //Variables para la TABLA DISUACIONES
                        dibujarTablaDisuaciones: false,
                        disuaciones:[],
                        disuacion:{
                            id:null,
                            nombre:null,
                            medio: null,
                            fechaYHora: null,                 
                        },                       
                        //Variables para la MENU DESPLEGABLE HABITACIONES, TABLA HABITACIONES Y TODO LO REFERENTE A HABITACIONES
                        habitaciones: [],
                        /*habitaciones:[
                            {
                                title: 'Jardin',
                                active: true,
                                items: [
                                    { title: 'Perimetro principal', icon: 'mdi-wall', tipo: 'Sensor', header: 'S. Perimetral', method: () => this.menuHabitacionesEspecifico('Jardin','jardinsensorperimetralperimetroprincipal','Sensor','Perimetro principal',true,1)},
                                    { title: 'Puerta principal', icon: 'mdi-door-open', tipo: 'Puerta', header: ['Estado','Medio','S. Mov. Anterior','S. Mov. Posterior','Automatico'], method: () => this.menuHabitacionesEspecifico('Jardin','jardinpuertapuertaprincipal','Puerta','Puerta principal', true, 2)},
                                    { title: 'Luces jardin', icon: 'mdi-coach-lamp', tipo: 'Actuador', header: 'E. Activacion', method: () => this.menuHabitacionesEspecifico('Jardin','jardinactuadorlucesjardin','actuador','Luces jardin', true, 3)},
                                ], 
                                method: () => this.menuHabitaciones()                      
                            },
                            {
                                title: 'Tienda',
                                active: true,
                                items: [
                                    { title: 'Ventana', icon: 'mdi-window-open-variant', tipo: 'Sensor', header: 'S. Apertura ', method: () => this.menuHabitacionesEspecifico('Tienda','tiendasensoraperturaventanabano','Sensor','Ventana', true,4)},
                                    { title: 'Puerta Garaje', icon: 'mdi-door', tipo: 'Sensor', header: 'S. Apertura ', method: () => this.menuHabitacionesEspecifico('Tienda','tiendasensoraperturapuertagaraje','Sensor','Puerta Garaje', true,5)},
                                    { title: 'Sensor Movimiento tienda', icon: 'mdi-motion-sensor', tipo: 'Sensor', header: 'S. Movimiento ', method: () => this.menuHabitacionesEspecifico('Tienda','tiendasensormovimientosalidatienda','Sensor','Sensor Movimiento tienda', true, 6)},
                                ],
                                method: () => this.menuHabitaciones() 
                            },
                            {
                                title: 'Habitacion principal',
                                active: true,
                                items: [
                                    { title: 'Balcon', icon: 'mdi-window-open-variant', tipo: 'Sensor', header: 'S. Apertura ', method: () => this.menuHabitacionesEspecifico('Habitacion principal','habitacionprincipalsensoraperturapuertabalcon','Sensor','Balcon', true, 7)},
                                ],
                                method: () => this.menuHabitaciones() 
                            }
                        ],*/
                        //Variables para la TABLA MULTIMEDIA Y USUARIOS                   
                        menusFijos: [
                                {
                                    title: 'Multimedia',
                                    action: 'mdi-video',
                                    active: true,
                                    items: [
                                        { title: 'Almacenamiento', icon: 'mdi-folder-multiple', method: () => this.menuMultimediaMultimedia('Multimedia')},
                                        { title: 'En vivo', icon: 'mdi-video-box', method: () => this.menuMultimediaEnVivo('Multimedia')},
                                    ],                                   
                                    method: () => this.menuMultimedia()
                                },
                                {
                                    title: 'Usuarios',
                                    action: 'mdi-account-group',
                                    active: true,
                                    items: [
                                        { title: 'Administracion de Usuarios', icon: 'mdi-account-edit', method: () => this.menuUsuariosAdministracion('Usuarios')},
                                        { title: 'Disuaciones', icon: 'mdi-alarm-light-off', method: () => this.menuUsuariosDisuaciones('Usuarios')},
                                        { title: 'SOS', icon: 'mdi-car-emergency', method: () => this.menuUsuariosSocorro('Usuarios')},
                                    ],                                   
                                    method: () => this.menuUsuarios()
                                },
                                {
                                    title: 'Administracion del Hogar',
                                    action: 'mdi-home-lightbulb-outline',
                                    active: true,
                                    items: [
                                        { title: 'Dispositivos', icon: 'mdi-lightbulb', method: () => this.mostrarTablaDispositivos('Administracion del Hogar')},
                                        { title: 'Habitaciones', icon: 'mdi-door-open', method: () => this.mostrarTablaHabitaciones('Administracion del Hogar')},                                       
                                    ],                                   
                                    method: () => this.menuDispositivos()
                                },
                            ],
                    }                  
                },
            methods:{
                reformatearHora:function(datoFechaYHora){
                    var datoFechaYHoraCortado = datoFechaYHora.substr(0,16);
                    var arrayDatoFechaYHora = datoFechaYHoraCortado.split("T");
                    var arrayDatoFecha = arrayDatoFechaYHora[0].split("-");
                    var nuevaFecha = [];
                    for (var i = (arrayDatoFecha.length - 1); i >= 0; i--) {  
                        if (i == 1){
                            var meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
                            var mes = Number(arrayDatoFecha[i]);
                            nuevaFecha.push("de "+ meses[mes - 1]);
                        }
                        if (i == 0){
                            nuevaFecha.push(" del " + arrayDatoFecha[i]);
                        }
                        if (i == 2){
                            nuevaFecha.push(arrayDatoFecha[i] + " ");
                        } 
                    }
                    var nuevaFechastring = '';
                    for (let i = 0; i < nuevaFecha.length ; i++) {
                        let palabra = String(nuevaFecha[i]);
                        nuevaFechastring = nuevaFechastring + palabra;
                    }
                    var arrayDatoFechaYHoraFinal =  nuevaFechastring + ' ' + arrayDatoFechaYHora[1];
                    return arrayDatoFechaYHoraFinal;
                },
                pinesRestantesValue:function(){
                    let todosPines = this.todosPines;
                    let pinesMySQL = this.valorPines;
                    let pinesMySQLArray = [];
                    for (let pines of pinesMySQL) {
                        let numeros = pines['pin'];
                        if (numeros != null) {
                            pinesMySQLArray.push(numeros)
                        }
                    }
                    function comparar ( a, b ){ return a - b; }
                    function removeItemFromArr ( arr, item ) {
                        var i = arr.indexOf( item );
                        arr.splice( i, 1 );
                    }

                    let pinesMySQLArrayOrdenados = pinesMySQLArray.sort(comparar);
                    //console.log(pinesMySQLArrayOrdenados);
                    for (let i = 0; i < Object.keys(todosPines).length; i++) {
                        let PinComparacionUno = todosPines[i];
                        for (let m = 0; m < Object.keys(pinesMySQLArrayOrdenados).length; m++) {
                            let PinComparacionDos = pinesMySQLArrayOrdenados[m]
                            if (PinComparacionUno == PinComparacionDos) {
                                removeItemFromArr( todosPines,PinComparacionDos );
                                pinesRestantes = todosPines;
                                //console.log('Removiendo: ' + PinComparacionDos);
                                //console.log(Pines);
                            }
                        }
                    }
                    return todosPines;
                },
                cargandoDatosDispositivos: function(){
                    axios.get(url + 'dispositivos/')
                    .then(response => {
                        this.dispositivoss = response.data;
                    })
                },
                cargandoDatosHabitaciones: function() {
                    axios.get(url + 'habitaciones/')
                    .then(response => {
                        this.nuevasHabitacioness = response.data;
                    })
                },
                armandoArregloHabitaciones: async function(){
                    await this.cargandoDatosDispositivos();
                    await this.cargandoDatosHabitaciones();
                    let dispositivoss = this.dispositivoss;
                    let habitacioness = this.nuevasHabitacioness;
                    //LOGICA DE ARMADO DE ARRAY "habitaciones"
                    let arregloHabitaciones = new Array();
                    for (let i = 0; i < Object.keys(habitacioness).length; i++) {
                      
                        let subHabitacion = new Object();
                        subHabitacion = {
                            title: habitacioness[i].nombre,
                            active: true,
                            method: () => this.menuHabitaciones(),
                        }
                        //console.log(subHabitacion.title)
                        let arregloItems = new Array();
                        for (let i = 0; i < Object.keys(dispositivoss).length; i++) {       
                            let subObjeto = new Object();  
                            if (dispositivoss[i].habitacion == subHabitacion.title) {
                                subObjeto = {
                                title: dispositivoss[i].nombre,
                                icon: dispositivoss[i].icono,
                                tipo: dispositivoss[i].tipo,
                                header: dispositivoss[i].header, 
                                method: () => this.menuHabitacionesEspecifico(dispositivoss[i].habitacion,dispositivoss[i].tabla,dispositivoss[i].tipo,dispositivoss[i].nombre, true,dispositivoss[i].id)           
                                }  
                            };
                            
                            if (Object.keys(subObjeto).length != 0) {               
                                arregloItems.push(subObjeto);
                            }
                            
                        }  
                        let arregloHabitacion = new Object();
                        arregloHabitacion  = {
                            title: subHabitacion.title,
                            active: true,
                            method: () => this.menuHabitaciones(),
                            items: arregloItems,
                        }
                        
                        arregloHabitaciones.push(arregloHabitacion);
                    }
                    //console.log(arregloHabitaciones);
                    this.habitaciones = arregloHabitaciones               
                },
                dibujarMenuDesplegable: async function(){
                    await this.armandoArregloHabitaciones();
                    this.dibujarMenu = !this.dibujarMenu;
                },
                //Metodos para el CRUD de los USUARIOS
                iterandoNombreHabitaciones:function() {
                    let nombreHabitaciones = this.nuevasHabitaciones;
                    let resultado = [];
                    for (let i = 0; i < Object.keys(nombreHabitaciones).length; i++) {     
                        resultado.push(nombreHabitaciones[i].nombre);
                    }
                    return resultado;
                },
                //Metodos de visualizacion para los headers de las tablas de ADMINISTRACION DE DISPOSITIVOS
                iterandoHeadersArrayDispositivo:function(dato){ 
                    let dispositivoDato = dato;
                    let res;
                    let arrayFinal = new Array();
                    let ress;
                    for (let i = 0; i < Object.keys(this.habitaciones).length; i++) {
                        res = this.habitaciones[i].items;
                        for (let x = 0; x < Object.keys(res).length; x++) {
                            ress = res[x];
                            //console.log(ress.header);
                            if (res[x].title == dispositivoDato) {
                                switch (ress.tipo) {
                                    case 'Sensor':
                                        arrayFinal[0] = res[x].header;
                                        return Array.from(arrayFinal);
                                    case 'Puerta':
                                        arrayFinal[0] = res[x].header;
                                        return arrayFinal; 
                                    case 'Actuador':
                                        arrayFinal[0] = res[x].header;
                                        return arrayFinal;             
                                }
                            }           
                        }                                                          
                    }                                 
                },
                //Metodos de los botones del formulario para admnistrar los USUARIOS
                mostrar:function(){
                    axios.get(url + 'users/')
                    .then(response => {
                        this.users = response.data;                      
                    })
                },
                crear:function(){
                    if ((this.usuario.nombre != '') && (this.usuario.usuario != '') && (this.usuario.rol != '') && (this.usuario.contrasena != '') && (this.usuario.celular != '')) {
                        let parametros = {nombre:this.usuario.nombre,usuario:this.usuario.usuario,rol:this.usuario.rol,contrasena:this.usuario.contrasena, celular:this.usuario.celular};
                        axios.post(url + 'users/' ,parametros).then(response => {
                            Swal.fire({
                                title:'Registro',
                                text: 'Registro exitoso!',
                                icon: 'success',
                                showConfirmButton: false,
                                timer: 2000
                            })
                            .then(()=>{
                                this.mostrar();               
                            })
                        });
                    }
                    else{
                        Swal.fire({
                            title: 'Error',
                            text: 'Complete todos los campos',                             
                            icon: 'error',
                            showConfirmButton: true,
                        })
                        .then(()=>{
                            this.mostrar();               
                        })     
                    }
                },
                editar:function(){
                    let parametros = {nombre:this.usuario.nombre,usuario:this.usuario.usuario,rol:this.usuario.rol,id:this.usuario.id,celular:this.usuario.celular};
                    if ((this.usuario.nombre != '') && (this.usuario.usuario != '') && (this.usuario.rol != '') && (this.usuario.celular != '')) {
                        axios.put(url + 'users/' + this.usuario.id, parametros).then(response => {  
                            Swal.fire({
                                title: 'Edición',
                                text: 'Edición exitosa!',                             
                                icon: 'success',
                                showConfirmButton: false,
                                timer: 2000
                            })
                            .then(()=>{
                                this.mostrar();               
                            })                           
                        });
                    }
                    else{
                        Swal.fire({
                            title: 'Edición',
                            text: 'Error en la edición.',                             
                            icon: 'error',
                            showConfirmButton: true,
                            timer: 2000
                        })
                        .then(()=>{
                            this.mostrar();               
                        })       
                    }
                },
                borrar:function(id){
                    Swal.fire({
                        title:'Confirma la eliminación del usuario?',
                        confirmButtonText:'Confirmar',
                        showCancelButton: true,
                    })
                    .then((result) => {
                        if (result.isConfirmed) {
                            axios.delete(url + 'users/' + id)
                            .then(response =>{
                                console.log('Borrado!');
                                this.mostrar();
                            });
                            Swal.fire('Eliminado','', 'success')       
                        }
                        else if(result.isDenied){
                        }
                    });
                },                
                guardar:function(){
                    if (this.operacion == 'crear') {
                        this.crear();
                    }
                    if (this.operacion == 'editar') {
                        this.editar();
                    }
                    this.dialog = false;
                },
                formNuevo:function(){
                    this.accionFormulario = true;
                    this.accionFormularioDos = true;
                    this.nombreBoton = 'Registrar';
                    this.name = 'Nuevo Usuario';
                    this.operacion = 'crear';
                    this.numUsuario = '';
                    this.dialog = true;
                    this.usuario.nombre = '';
                    this.usuario.usuario = '';
                    this.usuario.rol = '';
                    this.usuario.fechaYHora = '';
                    this.usuario.login = '';
                    this.usuario.logout = '';
                    this.usuario.contrasena = '';
                    this.usuario.contrasenaDos = '';
                    this.usuario.celular = '';
                },
                formEditar:function(id,nombre,usuario,rol,celular){
                    this.nombreBoton = 'Editar';
                    this.accionFormulario = false;
                    this.accionFormularioDos = false;
                    this.name = 'Editando Usuario # ';
                    this.operacion = 'editar';
                    this.dialog = true;
                    this.numUsuario = id;
                    this.usuario.id = id;
                    this.usuario.nombre = nombre;
                    this.usuario.usuario =usuario;
                    this.usuario.rol = rol;                   
                    this.usuario.celular = celular;
                },
                //PAGINACION
                //Metodos para la visualizacion de HOJAS correspondientes a MENU SELECCIONADO
                tablasEnFalso: function(){
                    this.dibujarTablaHabitaciones = false;
                    this.dibujarTablaUsuarios = false;
                    this.dibujarBotonNuevoUsuario = false; 
                    this.dibujarTablaMultimedia = false;
                    this.dibujarTablaSocorro = false;
                    this.dibujarTablaDisuaciones = false;
                    this.dibujarBotonNuevaHabitacion = false;
                    this.dibujarBotonNuevoDispositivo = false;
                    this.dibujarTablaDispositivos = false;
                    this.dibujarTablaAdministracionHabitaciones = false;
                    this.dibujarTablaEnVivo = false;
                    this.cajonPerfilUsuario = false;
                    this.cajonHome = false;
                },
                menusEnFalso: function(){
                    this.dibujarMenuHome = false,
                    this.dibujarMenuHabitaciones = false;
                    this.dibujarMenuMultimedia = false;
                    this.dibujarMenuUsuarios = false;
                    this.dibujarMenuAccount = false;
                    this.dibujarMenuMultimediaUsuariosDispositivos = false;
                    this.dibujarMenuAdministracionHabitaciones = false;
                },
                //Metodos de visualizacion para la seccion HOME
                menuHome: async function(){
                    await this.menusEnFalso();                    
                    await this.tablasEnFalso();
                    this.dibujarMenuHome = true;
                    this.cajonHome = true;
                },
                //Metodos de visualizacion para la seccion HABITACIONES
                menuHabitaciones: async function(){                                
                },
                menuHabitacionesEspecifico: async function(tabs,nombreTabla, nombreTipoDispositivo, nombreDispositivo, mostrarCuerpoTablaIterable,id){
                    this.filtrarHeadersPorHabitacion = tabs;  
                    await this.menusEnFalso();  
                    this.dibujarMenuHabitaciones = true;                             
                    await this.tablasEnFalso();
                        axios.get(url + 'habitaciones/'+ id)
                            .then(response => {
                                this.datos = response.data;
                            })         
                    /*await this.tablasEnFalso();
                    axios.get(url + nombreTabla +'/')
                        .then(response => {
                            this.datos = response.data;
                        })*/
                    this.mostrarCuerpoTablaIterableAlDispararSubmenu = mostrarCuerpoTablaIterable;
                    this.mostrarDatosTablaSegunTipoDeDispositivo = nombreTipoDispositivo;
                    this.filtrarHeadersPorDispositivoDeHabitacion = nombreDispositivo;
                    this.dibujarTablaHabitaciones = true;                        
                },
                //Metodos de visualizacion para la seccion MULTIMEDIA
                menuMultimedia: async function(){
                    await this.menusEnFalso();
                    this.dibujarMenuMultimediaUsuariosDispositivos = true;
                },
                    menuMultimediaMultimedia: async function(tabs){
                        await this.menuMultimedia();
                        this.filtrarHeadersPorMultimediaYUsuarios = tabs;
                        await this.tablasEnFalso();                       
                        
                        axios.get(url + 'camara/')
                        .then(response => {
                            let array = response.data;                           
                            for (let i = 0; i < Object.keys(array).length; i++) {                               
                                let ruta = response.data[i];
                                let dir = ruta['c_ruta'];
                                let rutaCortada = dir.substring(32);
                                array.map(function(dato){
                                    if (dato.c_ruta == dir){
                                        dato.c_ruta = rutaCortada;
                                    }
                                })                               
                            }
                            console.log(array);
                            this.multimedias = array;
                        })
                        this.dibujarTablaMultimedia = true;
                    },
                    menuMultimediaEnVivo: async function(tabs){
                        await this.menuMultimedia();
                        this.filtrarHeadersPorMultimediaYUsuarios = tabs;
                        await this.tablasEnFalso(); 
                        this.dibujarTablaEnVivo = true;

                    }, 
                //Metodos de visualizacion para la seccion USUARIOS
                menuUsuarios: async function(){
                    await this.menusEnFalso();
                    this.dibujarMenuMultimediaUsuariosDispositivos = true;
                },  
                    //ADMINISTRACION DE USUARIOS
                    menuUsuariosAdministracion: async function(tabs){
                        await this.menuUsuarios();
                        this.filtrarHeadersPorMultimediaYUsuarios = tabs;
                        await this.tablasEnFalso();
                        this.dibujarTablaUsuarios = true;
                        this.dibujarBotonNuevoUsuario = true;
                        this.mostrar();
                    },
                    //SOCORRO
                    menuUsuariosSocorro: async function(tabs){
                        await this.menuUsuarios();
                        this.filtrarHeadersPorMultimediaYUsuarios = tabs;
                        await this.tablasEnFalso();
                        this.dibujarTablaSocorro = true;
                        axios.get(url + 'socorro/')
                        .then(response => {
                            this.socorros = response.data;
                        })                       
                    },
                    //DISUACIONES
                    menuUsuariosDisuaciones: async function(tabs){
                        await this.menuUsuarios();
                        this.filtrarHeadersPorMultimediaYUsuarios = tabs;
                        await this.tablasEnFalso();
                        this.dibujarTablaDisuaciones = true;
                        axios.get(url + 'disuasiones/')
                        .then(response => {
                            this.disuaciones = response.data;
                        })
                    },
                //Metodos de visualizacion para la seccion ADMINISTRACION DE DISPOSITIVOS
                menuDispositivos: async function(){  
                    await this.menusEnFalso();                 
                    this.dibujarMenuMultimediaUsuariosDispositivos = true;
                },
                    //TABLA DISPOSITIVOS
                    mostrarTablaDispositivos: async function(tabs){
                        await this.menuDispositivos();
                        await this.tablasEnFalso();
                        this.dibujarBotonNuevoDispositivo = true;
                        this.dibujarTablaDispositivos = true;
                        this.dibujarBotonNuevaHabitacion = false;
                        this.dibujarTablaAdministracionHabitaciones = false;                  
                        this.dibujarMenuAdministracionHabitaciones = true;
                        this.filtrarHeadersPorMultimediaYUsuarios = tabs;
                        await axios.get(url + 'dispositivos/')
                        .then(response => {
                            this.dispositivos = response.data;
                        })                                                     
                    },
                    //CREAR DISPOSITIVO                      
                    crearNuevoDispositivo: async function(){                      
                        if ((this.dispositivo.nombre == '') || (this.dispositivo.habitacion == '') || (this.dispositivo.icono == '') || (this.dispositivo.tipo == '') || (this.dispositivo.pin == '')) {
                            Swal.fire({
                                title: 'Registro',
                                text: 'Error de registro complete los campos.',                             
                                icon: 'error',
                                showConfirmButton: true,
                            })
                            .then(()=>{
                                this.mostrarTablaDispositivos('Administracion del Hogar');                                                                        
                            })
                            return
                        }
                        let parametrosDisp = {nombre:this.dispositivo.nombre,habitacion:this.dispositivo.habitacion,icono:this.dispositivo.icono,tipo:this.dispositivo.tipo,pin:this.dispositivo.pin};
                        axios.post(url + 'dispositivos/', parametrosDisp).then(response => {
                            this.mensaje = response.data;
                            Swal.fire({
                                title:'Registro',
                                text: 'Registro de dispositivo exitoso!',
                                icon: 'success',
                                showConfirmButton: false,
                                timer: 2000
                            })
                            .then(()=>{
                                this.mensaje == '';
                                this.mostrarTablaDispositivos('Administracion del Hogar');                     
                            }) 
                            .catch(error => {
                                Swal.fire({
                                    title: 'Registro',
                                    text: 'Error al registrar el dispositivo. Intente nuevamente',                             
                                    icon: 'error',
                                    showConfirmButton: true,
                                })
                                .then(()=>{
                                    this.mensaje == '';
                                    this.mostrarTablaDispositivos('Administracion del Hogar');                                          
                                })   
                            });
                        });                                  
                    },
                    //EDITAR NUEVO DISPOSITIVO
                    editarNuevoDispositivo: async function(){
                        if ((this.dispositivo.nombre == '') || (this.dispositivo.habitacion == '') || (this.dispositivo.tipo == '') || (this.dispositivo.icono == '')) {
                            Swal.fire({
                                title: 'Edición',
                                text: 'Error de edición complete los campos.',                             
                                icon: 'error',
                                showConfirmButton: true,
                            })
                            .then(()=>{
                                this.mostrarTablaDispositivos('Administracion del Hogar');                                                                        
                            })
                            return
                        }
                        let parametrosDisp = {id:this.dispositivo.id,nombre:this.dispositivo.nombre,habitacion:this.dispositivo.habitacion,icono:this.dispositivo.icono,tipo:this.dispositivo.tipo,pin:this.dispositivo.pin};
                        axios.put(url + 'dispositivos/' + this.dispositivo.id, parametrosDisp).then(response => {  
                            Swal.fire({
                                title: 'Edición',
                                text: 'Edición exitosa!',                             
                                icon: 'success',
                                showConfirmButton: false,
                                timer: 2000
                            })
                            .then(()=>{
                                this.mostrarTablaDispositivos('Administracion del Hogar');               
                            })
                            .catch(error => {
                                Swal.fire({
                                    title: 'Edición',
                                    text: 'Error en la edición.',                             
                                    icon: 'error',
                                    showConfirmButton: true,
                                    timer: 2000
                                })
                                .then(()=>{
                                    console.log(error); 
                                    this.mostrarTablaDispositivos('Administracion del Hogar');                 
                                })           
                            });
                        });
                    },
                    //ELIMINAR DISPOSITIVO
                    eliminarDispositivo: async function(id){
                        Swal.fire({
                            title:'Confirma la eliminación del dispositivo?',
                            confirmButtonText:'Confirmar',
                            showCancelButton: true,
                        })
                        .then((result) => {
                            if (result.isConfirmed) {
                                axios.delete(url + 'dispositivos/' + id)
                                .then(response =>{
                                    console.log('Borrado!');                                  
                                    this.mostrarTablaDispositivos('Administracion del Hogar'); 
                                });
                                Swal.fire('Eliminado','', 'success')       
                            }
                            else if(result.isDenied){
                            }
                        });
                    },
                    //TABLA HABITACIONES
                    mostrarTablaHabitaciones: async function(tabs){
                        await this.menuDispositivos();
                        await this.tablasEnFalso();
                        this.dibujarBotonNuevoDispositivo = false;
                        this.dibujarTablaDispositivos = false;
                        this.dibujarBotonNuevaHabitacion = true;
                        this.dibujarTablaAdministracionHabitaciones = true;
                        this.dibujarMenuAdministracionHabitaciones = true;
                        this.filtrarHeadersPorMultimediaYUsuarios = tabs;
                        axios.get(url + 'habitaciones/')
                        .then(response => {
                            this.nuevasHabitaciones = response.data;
                        })
                    },        
                    //NUEVA HABITACION                                            
                    crearNuevaHabitacion: function(){ 
                        let parametrosHab = {nombre:this.nuevaHabitacion.nombre}; 
                        if (this.nuevaHabitacion.nombre == '') {
                            Swal.fire({
                                title: 'Registro',
                                text: 'Error de registro complete los campos.',                             
                                icon: 'error',
                                showConfirmButton: true,
                            })
                            .then(()=>{
                                this.mostrarTablaHabitaciones('Administracion del Hogar');                   
                            })
                            return;
                        }
                        axios.post(url + 'habitaciones/' , parametrosHab).then(response => {
                        Swal.fire({
                            title:'Registro',
                            text: 'Registro exitoso!',
                            icon: 'success',
                            showConfirmButton: false,
                            timer: 2000
                        })
                        .then(()=>{
                            this.mostrarTablaHabitaciones('Administracion del Hogar');                
                            })
                        });
                    },
                    //EDITAR HABITACION
                    editarNuevaHabitacion: async function(){
                        let parametrosHab = {id:this.nuevaHabitacion.id,nombre:this.nuevaHabitacion.nombre};
                        if (this.nuevaHabitacion.nombre == '') {
                            Swal.fire({
                                title: 'Edición',
                                text: 'Error de edición complete los campos.',                             
                                icon: 'error',
                                showConfirmButton: true,
                            })
                            .then(()=>{
                                this.mostrarTablaHabitaciones('Administracion del Hogar');                   
                            })
                            return;
                        }
                        axios.put(url + 'habitaciones/' + this.nuevaHabitacion.id, parametrosHab).then(response => {  
                            Swal.fire({
                                title: 'Edición',
                                text: 'Edición exitosa!',                             
                                icon: 'success',
                                showConfirmButton: false,
                                timer: 2000
                            })
                            .then(()=>{
                                this.mostrarTablaHabitaciones('Administracion del Hogar');                
                            })
                            .catch(error => {
                                Swal.fire({
                                    title: 'Edición',
                                    text: 'Error en la edición.',                             
                                    icon: 'error',
                                    showConfirmButton: true,
                                    timer: 2000
                                })
                                .then(()=>{
                                    console.log(error); 
                                    this.mostrarTablaHabitaciones('Administracion del Hogar');                   
                                })           
                            });
                        });
                    },
                    //ELIMINAR HABITACION
                    eliminarHabitacion: async function(id){
                        Swal.fire({
                            title:'Confirma la eliminación de la habitacion?',
                            confirmButtonText:'Confirmar',
                            showCancelButton: true,
                        })
                        .then((result) => {
                            if (result.isConfirmed) {
                                axios.delete(url + 'habitaciones/' + id)
                                .then(response =>{
                                    console.log('Borrado!');                                  
                                    this.mostrarTablaHabitaciones('Administracion del Hogar'); 
                                });
                                Swal.fire('Eliminado','', 'success')       
                            }
                            else if(result.isDenied){
                            }
                        });
                    },
                    formNuevoDispositivo: async function(){                                                                
                        this.operacionHabitacionDispositivo = 'dispositivos';
                        this.dialogNuevoDispositivo = true;
                        this.dispositivo.id = '';
                        this.dispositivo.nombre = '';
                        this.dispositivo.habitacion = '';
                        this.dispositivo.tipo = '';
                        this.dispositivo.tabla = '';
                        this.dispositivo.icono = '';
                        this.dispositivo.pin = '';
                        this.nombreCardAccionDispositivo = 'CREAR DISPOSITIVO';
                        this.nombreDispositivoAEditar = ''; 
                        this.accionHabitacionDispositivo = 'crearDispositivo'; 
                        await axios.get(url + 'habitaciones/')
                            .then(response => {
                                this.nuevasHabitaciones = response.data;
                            })
                        await axios.get(url + 'pines/')
                            .then(response => {
                                this.valorPines = response.data;
                            })  
                                             
                    },
                    formEditarDispositivo: async function(id,nombre,habitacion,tipo,tabla,icono,pin){                        
                        this.operacionHabitacionDispositivo = 'dispositivos'; 
                        this.dialogNuevoDispositivo = true;
                        this.dispositivo.id = id;
                        this.dispositivo.nombre = nombre;
                        this.dispositivo.habitacion = habitacion;
                        this.dispositivo.tipo = tipo;
                        this.dispositivo.tabla = tabla;
                        this.dispositivo.icono = icono; 
                        this.dispositivo.pin = pin;               
                        this.nombreCardAccionDispositivo = 'EDITANDO DISPOSITIVO : '; 
                        this.nombreDispositivoAEditar = nombre;
                        this.accionHabitacionDispositivo = 'editarDispositivo';
                        await axios.get(url + 'habitaciones/')
                            .then(response => {
                                this.nuevasHabitaciones = response.data;
                            })
                        await axios.get(url + 'pines/')
                            .then(response => {
                                this.valorPines = response.data;
                            })
                    },
                    formNuevaHabitacion: async function(){
                        this.operacionHabitacionDispositivo = 'habitaciones';    
                        this.dialogNuevaHabitacion = true;
                        this.nuevaHabitacion.id = '';
                        this.nuevaHabitacion.nombre = '';
                        this.nombreCardAccionHabitacion = 'AGREGAR HABITACION';
                        this.nombreHabitacionAEditar = '';
                        this.accionHabitacionDispositivo = 'crearHabitacion';               
                    },
                    formEditarHabitacion: async function(id,nombre){
                        this.operacionHabitacionDispositivo = 'habitaciones';
                        this.dialogNuevaHabitacion = true;
                        this.nuevaHabitacion.id = id;
                        this.nuevaHabitacion.nombre = nombre;
                        this.nombreCardAccionHabitacion = 'EDITANDO HABITACION : '; 
                        this.nombreHabitacionAEditar = nombre;
                        this.accionHabitacionDispositivo = 'editarHabitacion';
                    },
                    guardarDispositivo: async function(){
                        if (this.accionHabitacionDispositivo == 'crearDispositivo') {
                            this.dialogNuevoDispositivo = false;
                            this.crearNuevoDispositivo();
                        }
                        else if (this.accionHabitacionDispositivo == 'editarDispositivo') {
                            this.dialogNuevoDispositivo = false;
                            this.editarNuevoDispositivo();
                        }       
                        else if (this.accionHabitacionDispositivo == 'crearHabitacion') {
                            this.dialogNuevaHabitacion = false;
                            this.crearNuevaHabitacion();
                        }  
                        else if (this.accionHabitacionDispositivo == 'editarHabitacion') {
                            this.dialogNuevaHabitacion = false;
                            this.editarNuevaHabitacion();
                        }     
                    },
                //Metodos de visualizacion para la seccion ADMINISTRACION DE CUENTA            
                menuAccount: async function(){
                    await this.menusEnFalso();
                    this.dibujarMenuAccount = true;
                    await this.tablasEnFalso();
                    this.cajonPerfilUsuario = true;
                },
                    editarAccount: async function(){
                        this.nombreUsuarioCambioContrasena = 'Actualizar contrasena';
                        this.nombreBotonCambiarContrasena = 'GUARDAR';
                        this.dialogCambiarContrasena = true;                       
                    },
                    cambiarContrasena: async function(nombre){
                        if ((this.cambioContrasena.antiguaContrasena == '') || (this.cambioContrasena.nuevaContrasena == '') || (this.cambioContrasena.nombre == '')) {
                            Swal.fire({
                                title: 'Edición',
                                text: 'Error en la edición.',                             
                                icon: 'error',
                                showConfirmButton: true,
                                timer: 2000
                            })
                            .then(()=>{
                                this.dialogCambiarContrasena = false;
                                this.menuAccount();                   
                            })
                            return       
                        }
                        let parametros = {contrasenaAntigua:this.cambioContrasena.antiguaContrasena, contrasenaNueva:this.cambioContrasena.nuevaContrasena, nombre: this.cambioContrasena.nombre};                        
                        axios.post(url + 'cambioContrasena/' + nombre, parametros).then(response => {                           
                            Swal.fire({
                                title: 'Edición',
                                text: 'Edición exitosa!',                             
                                icon: 'success',
                                showConfirmButton: false,
                                timer: 2000
                            })
                            .then(()=>{
                                this.dialogCambiarContrasena = false;
                                this.menuAccount();                
                            })
                            .catch(error => {
                                Swal.fire({
                                    title: 'Edición',
                                    text: 'Error en la edición.',                             
                                    icon: 'error',
                                    showConfirmButton: true,
                                    timer: 2000
                                })
                                .then(()=>{
                                    this.dialogCambiarContrasena = false;
                                    console.log(error); 
                                    this.menuAccount();                   
                                })           
                            });                                                
                        });
                    },
                
                //Metodos para la visualizacion de los REGISTROS INDIVIDUALES
            },
            beforeMount(){
                this.dibujarMenuDesplegable()
            }
        });
