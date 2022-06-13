import os
import sys
import signal
import time
import json
from time import sleep
from gpiozero import LED, Button
from threading import Thread
from datetime import datetime
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
import mysql.connector
import teclado_mas_LCD_driver
import I2C_LCD_driver
import verificando_contrasena
import verificando_usuario_contrasena
import motion_instantanea

#DATOS DE CONEXION CON LA BBDD DE GENESIS BOT 

mydb = mysql.connector.connect(
  host="localhost",
  user="root",
  password="root",
  database="genesis"
)

mycursor = mydb.cursor()

#TIENDA
VENTANA_TIENDA = Button(11)
PUERTA_GARAJE = Button(23)
SENSOR_MOVIMIENTO_ENTRADA_TIENDA= Button(27) 

#JARDIN
PERIMETRO_PRINCIPAL = Button(22)
SIRENA = LED(19)
LUCES_JARDIN = LED(17)
LUCES_JARDIN_DOS = LED(6)

#JARDIN PUERTA
CONTACTO_CHAPA = Button(16)
CONTACTO_M_PUERTA = Button(26) 
CONTACTO_M_PUERTA_DOS = Button(25)
CHAPA = LED(5)
#MOTOR = LED(6) 

#HABITACION PRINCIPAL
BALCON_HABITACION_PRINCIPAL = Button(10)
PUERTA_HABITACION_PRINCIPAL = Button(24)

#BOTON DE PANICO
SOCORRO_BOTON_PANICO = Button(9)

PAHT_CRED = '/home/pi/Desktop/Genesis Py/genesis_credenciales.json'
URL_DB = 'https://genesis-32485-default-rtdb.firebaseio.com/'

REF_TIENDA_SENSORES = 'tienda/sensores'
REF_VENTANA_TIENDA = 'ventanatienda'
REF_PUERTA_GARAJE = 'puertagaraje'
REF_SENSOR_MOVIMIENTO_ENTRADA_TIENDA = 'sensormovimientoentradatienda'
H_REF_VENTANA_TIENDA = 'dateventanatienda'
H_REF_PUERTA_GARAJE = 'datepuertagaraje'
H_REF_SENSOR_MOVIMIENTO_ENTRADA_TIENDA = 'datesensormovimientoentradatienda'

REF_PUERTA = 'puertaprincipal'
REF_PUERTA_NOMBRE = 'nombre'
REF_CHAPA = 'chapa'
REF_CONTACTO_C = 'contacto_c'
REF_CONTACTO_M = 'contacto_m'
REF_CONTACTO_M_DOS = 'contacto_m_dos'
REF_MOTOR = 'motor'
REF_PUERTA_AUTOMATIC = 'automatic'
REF_PUERTA_AUTOMATIC_ANTERIOR = 'automaticanterior'
H_PUERTA_CONTACTO_C = 'h_puerta_contacto_c'
H_PUERTA_CONTACTO_M = 'h_puerta_contacto_m'
H_PUERTA_CONTACTO_M_DOS = 'h_puerta_contacto_m_dos'

REF_JARDIN_ACTUADORES = 'jardin/actuadores'
REF_LUCES_JARDIN = 'lucesjardin'
H_REF_LUCES_JARDIN = 'datelucesjardin'
REF_LUCES_JARDIN_AUTOMATICO = 'automaticolucesjardin'
REF_LUCES_JARDIN_AUTOMATICO_ANTERIOR = 'automaticoanteriorlucesjardin'
REF_LUCES_JARDIN_AUTOMATICO_HORA_ON = 'automaticohoraonlucesjardin'
REF_LUCES_JARDIN_AUTOMATICO_HORA_OFF = 'automaticohoraofflucesjardin'
REF_LUCES_JARDIN_NOMBRE = 'nombrelucesjardin'
REF_SIRENA = 'sirena'
H_REF_SIRENA = 'datesirena'
REF_SIRENA_AUTOMATICO = 'automaticosirena'
REF_SIRENA_AUTOMATICO_ANTERIOR = 'automaticoanteriorsirena'
REF_SIRENA_AUTOMATICO_HORA_ON = 'automaticohoraonsirena'
REF_SIRENA_AUTOMATICO_HORA_OFF = 'automaticohoraoffsirena'
REF_SIRENA_NOMBRE = 'nombresirena'
# # # # # # # # #
REF_JARDIN_SENSORES = 'jardin/sensores'
REF_PERIMETRO_PRINCIPAL = 'perimetroprincipal'
H_REF_PERIMETRO_PRINCIPAL = 'dateperimetroprincipal'

REF_HABITACION_PRINCIPAL_ACTUADORES = 'habitacionprincipal/actuadores'
REF_HABITACION_PRINCIPAL_SENSORES = 'habitacionprincipal/sensores'
REF_BALCON_HABITACION_PRINCIPAL = 'balconhabitacionprincipal'
H_REF_BALCON_HABITACION_PRINCIPAL = 'datebalconhabitacionprincipal'
REF_PUERTA_HABITACION_PRINCIPAL = 'puertahabitacionprincipal'
H_REF_PUERTA_HABITACION_PRINCIPAL = 'datepuertahabitacionprincipal'

REF_MODO = 'modo'
REF_MODO_M = 'modo'
REF_MODO_ANTERIOR = 'modoanterior'
REF_ARMADO_ON ='armadoon'
REF_ARMADO_OFF ='armadooff'

REF_USERS = 'users'
REF_USER_1 = 'usuario_1'
REF_USER_2 = 'usuario_2'
REF_USER_PASS = 'pass'

REF = '/'

REF_SOCORRO = 'socorro'
REF_SOCORRO_SOCORRO = 'socorro'
REF_SOCORRO_NOMBRE = 'nombre'

milcd = I2C_LCD_driver.lcd()

def hora():
    now = datetime.now()
    fecha_y_hora = now.strftime('%d/%m/%Y a horas %H:%M')
    return fecha_y_hora

def averiguandoNombreDeTabla(gpio):
    #gpio = 'GPIO22' 
    cortandoGPIO = gpio[4:]  
    enteroGPIO = int(cortandoGPIO)   
    sql = "SELECT * FROM dispositivos"            
    mycursor.execute(sql)
    myresult = mycursor.fetchall()
    pinesOutput = []
    for filas in myresult:
        pines = filas[9]
        tablas = filas[4]
        if (pines == enteroGPIO):
            print(pines)
            print(tablas)
            return(tablas)

def registrandoLogEnBBDD(gpio,aviso):
    tabla = averiguandoNombreDeTabla(gpio) 
    sql = 'INSERT INTO '+ tabla +' (estado) VALUES (%s)'
    val = (aviso,)
    mycursor.execute(sql, val)
    mydb.commit()

def registrandoLogPuertaEnBBDD(gpio,a,b,c,d,e):
    tabla = averiguandoNombreDeTabla(gpio) 
    sql = 'INSERT INTO '+ tabla +' (estado,medio,sensorAnterior,sensorPosterior,automatic) VALUES (%s,%s,%s,%s,%s)'
    a_sql = ''
    c_sql = ''
    d_sql = ''
    e_sql = ''
    
    if(a == True):
        a_sql = 'Puerta abierta'
    if(a == False):
        a_sql = 'Puerta cerrada'
    if(c == True):
        c_sql = 'Movimiento'
    if(c == False):
        c_sql = 'S. Movimiento'
    if(d == True):
        d_sql = 'Movimiento'
    if(d == False):
        d_sql = 'S. Movimiento'
    if(e == True):
        e_sql = 'M. Aut. Activado'
    if(e == False):
        e_sql = 'M. Aut. Desactivado'

    val = (a_sql,b,c_sql,d_sql,e_sql)
    mycursor.execute(sql, val)
    mydb.commit()

def mensajeLCD(mensajeUno,mensajeDos):
    milcd.lcd_clear()
    milcd.lcd_display_string(mensajeUno, 1)
    milcd.lcd_display_string(mensajeDos,2 )
    time.sleep(3)

def mensajeBienvenidaGenesis():
    milcd.lcd_clear()
    milcd.lcd_display_string("Bienvenido a ", 1)
    milcd.lcd_display_string("Genesis familia!",2 ) 

#registrandoLogEnBBDD()
#PROGRAMACION ORIENTADA A OBJETOS
class IOT():

    def __init__(self):
        #Creando conexion a BBDD (certificado,URL)
        cred = credentials.Certificate(PAHT_CRED)
        firebase_admin.initialize_app(cred, {
            'databaseURL': URL_DB
        })
        #MODOS
        self.refModo = db.reference(REF_MODO)
        self.refModoEstado = self.refModo.child(REF_MODO_M)
        self.refModoanterior = self.refModo.child(REF_MODO_ANTERIOR)
        self.refModoArmadoOn = self.refModo.child(REF_ARMADO_ON)
        self.refModoArmadoOff = self.refModo.child(REF_ARMADO_OFF)

        #JARDIN     
        self.refJardinActuadores = db.reference(REF_JARDIN_ACTUADORES)
        self.refLucesJardin = self.refJardinActuadores.child(REF_LUCES_JARDIN)
        self.refLucesJardinHora = self.refJardinActuadores.child(H_REF_LUCES_JARDIN)
        self.refLucesJardinAutomatico = self.refJardinActuadores.child(REF_LUCES_JARDIN_AUTOMATICO)
        self.refLucesJardinAutomaticoAnterior = self.refJardinActuadores.child(REF_LUCES_JARDIN_AUTOMATICO_ANTERIOR)
        self.refLucesJardinAutomaticoHoraOn = self.refJardinActuadores.child(REF_LUCES_JARDIN_AUTOMATICO_HORA_ON)
        self.refLucesJardinAutomaticoHoraOff = self.refJardinActuadores.child(REF_LUCES_JARDIN_AUTOMATICO_HORA_OFF)
        self.refLucesJardinNombre = self.refJardinActuadores.child(REF_LUCES_JARDIN_NOMBRE)
        self.refSirena = self.refJardinActuadores.child(REF_SIRENA)
        self.refSirenaHora = self.refJardinActuadores.child(H_REF_SIRENA)
        self.refSirenaAutomatico = self.refJardinActuadores.child(REF_SIRENA_AUTOMATICO)
        self.refSirenaAutomaticoAnterior = self.refJardinActuadores.child(REF_SIRENA_AUTOMATICO_ANTERIOR)
        self.refSirenaAutomaticoHoraOn = self.refJardinActuadores.child(REF_SIRENA_AUTOMATICO_HORA_ON)
        self.refSirenaAutomaticoHoraOff = self.refJardinActuadores.child(REF_SIRENA_AUTOMATICO_HORA_OFF)
        self.refSirenaNombre = self.refJardinActuadores.child(REF_SIRENA_NOMBRE)
        # # # # # # # # # # # # #
        self.refJardinSensores = db.reference(REF_JARDIN_SENSORES)
        self.refPerimetroPrincipal = self.refJardinSensores.child(REF_PERIMETRO_PRINCIPAL)
        self.refPerimetroPrincipalHora = self.refJardinSensores.child(H_REF_PERIMETRO_PRINCIPAL)

        self.refPuerta = db.reference(REF_PUERTA)
        self.refChapa = self.refPuerta.child(REF_CHAPA)
        self.refPuertaC = self.refPuerta.child(REF_CONTACTO_C)
        self.refPuertaM = self.refPuerta.child(REF_CONTACTO_M)
        self.refPuertaMDos = self.refPuerta.child(REF_CONTACTO_M_DOS)
        self.refPuertaMotor = self.refPuerta.child(REF_MOTOR)
        self.refPuertaNombre = self.refPuerta.child(REF_PUERTA_NOMBRE)
        self.refPuertaAutomatic = self.refPuerta.child(REF_PUERTA_AUTOMATIC)
        self.refPuertaAutomaticAnterior = self.refPuerta.child(REF_PUERTA_AUTOMATIC_ANTERIOR)
        self.refHoraPuertaContactoC = self.refPuerta.child(H_PUERTA_CONTACTO_C)
        self.refHoraPuertaContactoM = self.refPuerta.child(H_PUERTA_CONTACTO_M)
        self.refHoraPuertaContactoMDos = self.refPuerta.child(H_PUERTA_CONTACTO_M_DOS)   

        #TIENDA
        self.refTiendaSensores = db.reference(REF_TIENDA_SENSORES)        
        self.refTiendaVentanaTienda = self.refTiendaSensores.child(REF_VENTANA_TIENDA)
        self.refTiendaPuertaGaraje = self.refTiendaSensores.child(REF_PUERTA_GARAJE)
        self.refTiendaSensorMovimientoEntradaTienda = self.refTiendaSensores.child(REF_SENSOR_MOVIMIENTO_ENTRADA_TIENDA)
        self.refTiendaDateVentanaTienda = self.refTiendaSensores.child(H_REF_VENTANA_TIENDA)
        self.refTiendaDatePuertaGaraje = self.refTiendaSensores.child(H_REF_PUERTA_GARAJE)
        self.refTiendaDateSensorMovimientoEntradaTienda = self.refTiendaSensores.child(H_REF_SENSOR_MOVIMIENTO_ENTRADA_TIENDA)

        #HABITACION PRINCIPAL
        self.refHabitacionPrincipalSensores = db.reference(REF_HABITACION_PRINCIPAL_SENSORES)
        self.refHabitacionPrincipalBalconHabitacionPrincipal = db.reference(REF_BALCON_HABITACION_PRINCIPAL)
        self.refHabitacionPrincipalPuertaHabitacionPrincipal = db.reference(REF_PUERTA_HABITACION_PRINCIPAL)
        self.refHabitacionPrincipalDateBalconHabitacionPrincipal = db.reference(H_REF_BALCON_HABITACION_PRINCIPAL)
        self.refHabitacionPrincipalDatePuertaHabitacionPrincipal = db.reference(H_REF_PUERTA_HABITACION_PRINCIPAL)

        #USUARIOS
        self.refUsuario = db.reference(REF_USERS)
        self.refUsuarioUno = self.refUsuario.child(REF_USER_1)
        self.refUsuarioDos = self.refUsuario.child(REF_USER_2)
        self.refPassUno = self.refUsuarioUno.child(REF_USER_PASS)
        self.refPassDos = self.refUsuarioDos.child(REF_USER_PASS)

        #SOCORRO
        self.refSocorro = db.reference(REF_SOCORRO)
        self.refSocorroSocorro = db.reference(REF_SOCORRO_SOCORRO)
        self.refSocorroNombre = db.reference(REF_SOCORRO_NOMBRE)

        milcd.lcd_clear()
        milcd.lcd_display_string("Iniciando", 1)
        milcd.lcd_display_string("Firabase-Genesis",2 )
        time.sleep(5)

#LECTURADOR INICIAL
        #TIENDA
        ventana_tienda = VENTANA_TIENDA.is_active
        self.refTiendaSensores.update({"ventanatienda" : ventana_tienda})
        self.refTiendaSensores.update({"dateventanatienda" : hora()})
        puerta_garaje = PUERTA_GARAJE.is_active
        self.refTiendaSensores.update({"puertagaraje" : puerta_garaje})
        self.refTiendaSensores.update({"datepuertagaraje" : hora()})
        sensor_movimiento_entrada_tienda = SENSOR_MOVIMIENTO_ENTRADA_TIENDA.is_active
        self.refTiendaSensores.update({"sensormovimientoentradatienda" : sensor_movimiento_entrada_tienda})
        self.refTiendaSensores.update({"datesensormovimientoentradatienda" : hora()})
        
        #JARDIN
        perimetro_principal = PERIMETRO_PRINCIPAL.is_active
        self.refJardinSensores.update({"perimetroprincipal" : perimetro_principal})
        self.refJardinSensores.update({"dateperimetroprincipal" : hora()})
        self.refJardinActuadores.update({"sirena" : False})
        self.refJardinActuadores.update({"datesirena" : hora()})
        self.refJardinActuadores.update({"nombresirena" : ''})
        
        #SOCORRO
        self.refSocorro.update({"socorro" : False})
        self.refSocorro.update({"nombre" : ''})

        h = time.strftime("%H")
        horaModoIniciar = str(self.refModoArmadoOn.get())
        horaModoIniciarHora_ = horaModoIniciar[:2]
        horaModoFinalizar = str(self.refModoArmadoOff.get())
        horaModoFinalizarHora_ = horaModoFinalizar[:2] 

        modo_ = self.refModoEstado.get()
        if ((int(horaModoFinalizarHora_) < int(horaModoIniciarHora_) <= int(h) <= 23) or (00 <= int(horaModoIniciarHora_) <= int(h) < int(horaModoFinalizarHora_)) and (modo_ == "habitado")):
            modoEstado = self.refModoEstado.get()
            self.refModo.update({"modoanterior" : modoEstado})
            print("Iniciando modo deshabitado automaticamente")
            self.refModo.update({"modo" : "deshabitado"})
            self.cambiosAutomaticoIniciar()

        elif ((int(horaModoFinalizarHora_) <= int(h) <= int(horaModoIniciarHora_) <= 23) and (modo_ == "deshabitado")):
            modoEstado = self.refModoanterior.get()
            print("Finalizando modo deshabitado automaticamente")
            self.refModo.update({"modo" : modoEstado})
            self.refModo.update({"modoanterior" : ""})
            self.cambiosAutomaticoFinalizar()  
        
        milcd.lcd_clear()
        milcd.lcd_display_string("Actualizando...", 1)
        milcd.lcd_display_string("Firebase-Genesis",2 )
        time.sleep(3)
        milcd.lcd_clear()
        milcd.lcd_display_string("Bienvenido a ", 1)
        milcd.lcd_display_string("Genesis familia!",2)
     
    def activandoSocorro(self):
        self.refSocorro.update({"socorro" : True})
        self.refSocorro.update({"nombre" : "Genesis"})

    def activandoAlarma(self,mensajeUno,mensajeDos):
        print('Se confirma actividad de posible vulneracion')
        mensajeLCD(mensajeUno,mensajeDos)
        self.refJardinActuadores.update({"sirena" : True})
        sleep(35)        
        automaticoo = self.refSirenaAutomatico.get()
        sirenaa = self.refSirena.get()
        if ((automaticoo == True) and (sirenaa == True)):
            SIRENA.on()

    def cambiosAutomaticoIniciar(self):
        modoPuerta = self.refPuertaAutomatic.get()
        self.refPuerta.update({"automaticanterior" : modoPuerta})
        self.refPuerta.update({"automatic" : True})

        modoLucesJardin = self.refLucesJardinAutomatico.get()
        self.refJardinActuadores.update({"automaticoanteriorlucesjardin" : modoLucesJardin})
        self.refJardinActuadores.update({"automaticolucesjardin" : True})

        modoSirena = self.refSirenaAutomatico.get()
        self.refJardinActuadores.update({"automaticoanteriorsirena" : modoSirena})
        self.refJardinActuadores.update({"automaticosirena" : True})

    def cambiosAutomaticoFinalizar(self):
        modoPuerta = self.refPuertaAutomaticAnterior.get()
        self.refPuerta.update({"automatic" : modoPuerta})
        self.refPuerta.update({"automaticanterior" : ""})

        modoLucesJardin = self.refLucesJardinAutomaticoAnterior.get()
        self.refJardinActuadores.update({"automaticolucesjardin" : modoLucesJardin})
        self.refJardinActuadores.update({"automaticoanteriorlucesjardin" : ""})

        modoSirena = self.refSirenaAutomaticoAnterior.get()
        self.refJardinActuadores.update({"automaticosirena" : modoSirena})
        self.refJardinActuadores.update({"automaticoanteriorsirena" : ""})

#CAMBIOS AUTOMATICOS POR HORARIOS DE LOS NIVELES DE SEGURIDAD 
    def cambiandoModosAutomatico(self):
        A,B,i = [],[],0       

        while True:
            modo = self.refModoEstado.get()
            horaModoIniciar = str(self.refModoArmadoOn.get())
            horaModoIniciarHora = horaModoIniciar[:2] 
            horaModoIniciarMinuto = horaModoIniciar[3:]

            horaModoFinalizar = str(self.refModoArmadoOff.get())
            horaModoFinalizarHora = horaModoFinalizar[:2] 
            horaModoFinalizarMinuto = horaModoFinalizar[3:]
            
            h = time.strftime("%H")
            m = time.strftime("%M")
            
            #Noche 11:59 PM
            if ((horaModoIniciarHora == h) and (horaModoIniciarMinuto == m) and (modo == "habitado")):
                modoEstado = self.refModoEstado.get()
                self.refModo.update({"modoanterior" : modoEstado})
                print("1")
                self.refModo.update({"modo" : "deshabitado"})
                self.cambiosAutomaticoIniciar()
                print("Se cambio al modo deshabitado!")
                mensajeLCD('Modo Deshabitado','Activado!')
                mensajeBienvenidaGenesis()    
                time.sleep(55)
            #Madrugada 5:00 AM
            elif ((horaModoFinalizarHora == h) and (horaModoFinalizarMinuto == m) and (modo == "deshabitado")):
                modoEstado = self.refModoanterior.get()
                print("4")
                self.refModo.update({"modo" : modoEstado})
                self.refModo.update({"modoanterior" : ""})
                self.cambiosAutomaticoFinalizar()   
                print("Se cambio al modo habitado")
                mensajeLCD('Modo Habitado','Activado!')
                mensajeBienvenidaGenesis() 
                time.sleep(55)
            time.sleep(2)

#JARDIN
#Perimetro principal
    #SENSOR
    def perimetroM_on(self):
        print('Actividad sospechosa')
        sleep(2)
        perimetro_actual = PERIMETRO_PRINCIPAL.is_active
        if (perimetro_actual == True):
            #Notificando mediante llamada telefonica y SMS
            self.activandoSocorro()           
            motion_instantanea.captura()
            print('Se confirma actividad de posible vulneracion en el muro')
            mensajeLCD('Alerta posible','Vulneracion!')
            self.refJardinSensores.update({"dateperimetroprincipal" : hora()})
            self.refJardinSensores.update({"perimetroprincipal" : True})
            self.refJardinActuadores.update({"sirena" : True})         
            sleep(35)
            perimetro = self.refPerimetroPrincipal.get()
            automatico = self.refSirenaAutomatico.get()
            if ((perimetro == True) and (automatico == True)):
                SIRENA.on()
   
    def lecturaPerimetroM(self):
        PERIMETRO_PRINCIPAL.when_pressed = self.perimetroM_on

    def validador(self,password):
        consultando = verificando_contrasena.verificando(password)
        medio = 'Tablero de Control'
        consulta_name = consultando["nombre"]
        print('El nombre recuperado es:' + consulta_name)
        consulta_estado = consultando["estado"]
        print(consulta_estado)
        if (consulta_estado == True):             
            SIRENA.off()
            self.refJardinActuadores.update({"sirena" : False})
            print ('Sirena apagada')
            mensajeLCD('Sirena','Apagada!')
            mensajeBienvenidaGenesis() 
            ##SQL-DISUASIONES
            sql = "INSERT INTO disuasiones (d_nombre, d_medio) VALUES (%s, %s)"
            val = (consulta_name,medio)
            mycursor.execute(sql, val)
            mydb.commit()           
            return(True)
        else:
            return(False)

    def controlMuro(self,perimetro_mov,automatic,sirena,nombre):
        contador = 0
        if ((automatic == True) and (sirena == True)):
            while True:
                print("Ingrese una contrasena:")
                resultado = teclado_mas_LCD_driver.mandar_password(sirena)
                print("La contrasena es: " + resultado)
                verify = self.validador(resultado)
                if (verify == True):
                    self.refJardinSensores.update({"perimetroprincipal" : False})
                    print("La contrasena se valido exitosamente")
                    milcd.lcd_clear()
                    milcd.lcd_display_string("Alarma disuadida", 1)
                    sleep(2)
                    milcd.lcd_clear()
                    print('Reiniciando proceso por autenticacion desde el Keyboard!')
                    os.execl(sys.executable, 'python','/home/pi/Desktop/Genesis Py/logica_genesis_copia.py', *sys.argv[1:])
                    break
                elif (verify == False):
                    contador = contador + 1
                    if (contador == 3):
                        print("Intentos maximos superados!. Intente nuevamente en 60 seg.")
                        sleep(20)
                        contador = 0
                sleep (0.5)
        elif ((perimetro_mov == True) and (automatic == False) and (sirena == True)):
            self.refJardinSensores.update({"perimetroprincipal" : False})
            self.refJardinActuadores.update({"sirena" : False})
        elif ((perimetro_mov == "movimiento") and (automatic == "automatic") and (sirena == False)):
            self.refJardinSensores.update({"perimetroprincipal" : False})
            print('Reiniciando proceso por autenticacion desde Google Assitant!')
            os.execl(sys.executable, 'python','/home/pi/Desktop/Genesis Py/logica_genesis_copia.py', *sys.argv[1:])

    def actuadoresLecturasMuro(self):
        A,B,C,D,i = [],[],[],[],0
        
        muro_mov = self.refPerimetroPrincipal.get()
        muro_automatic = self.refSirenaAutomatico.get()
        muro_sirena = self.refSirena.get()
        muro_nombre = self.refSirenaNombre.get()
        self.controlMuro(muro_mov,muro_automatic,muro_sirena,muro_nombre)
        A.append(muro_mov)
        B.append(muro_automatic)
        C.append(muro_sirena)
        D.append(muro_nombre)

        while True:
            muro_mov_actual = self.refPerimetroPrincipal.get()
            muro_automatic_actual = self.refSirenaAutomatico.get()
            muro_sirena_actual = self.refSirena.get()
            muro_nombre_actual = self.refSirenaNombre.get()
            A.append(muro_mov_actual)
            B.append(muro_automatic_actual)
            C.append(muro_sirena_actual)
            D.append(muro_nombre_actual)

            if (A[i] != A[-1]) or (B[i] != B[-1]) or (C[i] != C[-1]) or (D[i] != D[-1]):
                if (A[i] != A[-1]):
                    if muro_mov_actual == True:
                        print('Deteccion de obstruccion detectado registrado!')
                        #registrandoLogEnBBDD(str(PERIMETRO_PRINCIPAL.pin),'Obstaculo detectado')

                self.controlMuro(muro_mov_actual,muro_automatic_actual,muro_sirena_actual,muro_nombre_actual)
                
            del A[0]
            del B[0]
            del C[0]
            i = i + i
            sleep(1)  

    def actuadoresLecturasMuroDos(self):
        C,D,i = [],[],0
        sirena = self.refSirena.get()
        nombre = self.refSirenaNombre.get()
        C.append(sirena)
        D.append(nombre)

        while True:
            sirena_actual = self.refSirena.get()
            nombre_actual = self.refSirenaNombre.get()
            C.append(sirena_actual)
            D.append(nombre_actual)
            if (C[i] != C[-1]) or (D[i] != D[-1]):
                if ((sirena_actual == False) and (nombre_actual != '')):
                    accion = 'apagar'
                    #sql = "INSERT INTO orden (o_name, o_accion, o_elemento) VALUES (%s, %s, %s)"
                    #val = (nombre_actual,accion,'sirena')
                    #mycursor.execute(sql, val)
                    #mydb.commit()
                    self.controlMuro("movimiento","automatic",sirena_actual,nombre_actual)
            del C[0]
            i = i + i
            sleep(1)

    #Puerta principal
    #ACCIONADOR
    #Monitoreo de cambios de estado en tiempo real puerta principal
    def actuadoresLecturasPuerta(self):
        D,E,F,G,H,I,i = [],[],[],[],[],[],0

        motor_puerta = self.refPuertaMotor.get()
        mov_puerta_dos = self.refPuertaMDos.get()
        mov_puerta = self.refPuertaM.get()
        c_chapa_puerta = self.refPuertaC.get()
        chapa_puerta = self.refChapa.get()
        automatic_puerta = self.refPuertaAutomatic.get()
        
        I.append(motor_puerta)
        H.append(mov_puerta_dos)
        G.append(mov_puerta)
        F.append(c_chapa_puerta)
        E.append(chapa_puerta)
        D.append(automatic_puerta)

        while True:
          motor_puerta_actual = self.refPuertaMotor.get()
          mov_puerta_dos_actual = self.refPuertaMDos.get()
          mov_puerta_actual = self.refPuertaM.get()
          c_chapa_puerta_actual = self.refPuertaC.get()
          chapa_puerta_actual = self.refChapa.get()
          automatic_puerta_actual = self.refPuertaAutomatic.get()
          
          I.append(motor_puerta_actual)
          H.append(mov_puerta_dos_actual)
          G.append(mov_puerta_actual)
          F.append(c_chapa_puerta_actual)
          E.append(chapa_puerta_actual)
          D.append(automatic_puerta_actual)

          if (H[i] != H[-1]):
              self.refPuerta.update({"h_puerta_contacto_m_dos" : hora()})
          if (G[i] != G[-1]):
              self.refPuerta.update({"h_puerta_contacto_m" : hora()})
          if (F[i] != F[-1]):
                self.refPuerta.update({"h_puerta_contacto_c" : hora()})
                peticion = 'Modo manual'
                estado_nombre = self.refPuertaNombre.get()
                estado_modo = self.refModoEstado.get()
                if (estado_nombre != ''):
                    peticion = 'Google Assistant'
                    sql = "INSERT INTO orden (o_name, o_accion, o_elemento) VALUES (%s, %s, %s)"
                    val = (estado_nombre,chapa_puerta_actual,'Puerta principal')
                    mycursor.execute(sql, val)
                    mydb.commit() 
                    self.refPuerta.update({"nombre" : ''})    
                #sql = "INSERT INTO jardinpuertapuertaprincipal (estado, medio, sensorAnterior, sensorPosterior, automatic) VALUES (%s, %s, %s, %s, %s)"
                if (estado_modo == "deshabitado"):
                    self.activandoSocorro()
                    self.activandoAlarma('Alerta Puerta','principal abiert')
                print("Se detecto cambios en la puerta")
                #registrandoLogPuertaEnBBDD(str(CHAPA.pin),c_chapa_puerta_actual,peticion,mov_puerta_actual,mov_puerta_dos_actual,automatic_puerta_actual)
                                
          del I[0]
          del H[0]
          del G[0]
          del F[0]
          del E[0]
          del D[0]
          i = i + i
          sleep(1)

    #ACCIONADOR
    #Control Luces Jardin Automaticas
    def encendiendoLucesJardin(self,peticion):
        if (LUCES_JARDIN.is_active != peticion):
            if(peticion == True):
                LUCES_JARDIN.on()
                LUCES_JARDIN_DOS.on()
                self.refJardinActuadores.update({"datelucesjardin" : hora()})
                mensajeLCD('Luces del Jardin','Encendidas!')
                mensajeBienvenidaGenesis()
                print("Registrando cambios de las Luces del Jardin en la BBDD")
                #registrandoLogEnBBDD(str(LUCES_JARDIN.pin),'Luz Encendida')
            else:
                LUCES_JARDIN.off()
                LUCES_JARDIN_DOS.off()
                mensajeLCD('Luces del Jardin','Apagadas!')
                mensajeBienvenidaGenesis()
                #registrandoLogEnBBDD(str(LUCES_JARDIN.pin),'Luz Apagada')

    def LecturaLucesJardin(self):
        A,B,C,D,i = [],[],[],[],0
        estado = self.refLucesJardin.get()
        automatico= self.refLucesJardinAutomatico.get()
        automatico_hora_on = self.refLucesJardinAutomaticoHoraOn.get()
        automatico_hora_off = self.refLucesJardinAutomaticoHoraOn.get()
        self.encendiendoLucesJardin(estado)
        A.append(estado)
        B.append(automatico)
        C.append(automatico_hora_on)
        D.append(automatico_hora_off)

        while True:
            estado_actual = self.refLucesJardin.get()
            automatico_actual = self.refLucesJardinAutomatico.get()
            automatico_hora_on_actual = self.refLucesJardinAutomaticoHoraOn.get()
            automatico_hora_off_actual = self.refLucesJardinAutomaticoHoraOff.get()
            A.append(estado_actual)
            B.append(automatico_actual)
            C.append(automatico_hora_on_actual)
            C.append(automatico_hora_off_actual)

            if (A[i] != A[-1]) or (B[i] != B[-1]) or (C[i] != C[-1]) or (D[i] != D[-1]):
                peticion = 'Modo manual'
                estado_nombre = self.refLucesJardinNombre.get()
                if (estado_nombre != ''):
                    peticion = 'Google Assistant'
                    #sql = "INSERT INTO orden (o_name, o_accion, o_elemento) VALUES (%s, %s, %s)"
                    #val = (estado_nombre,chapa_puerta_actual,'puerta')
                    #mycursor.execute(sql, val)
                    #mydb.commit()
                self.encendiendoLucesJardin(estado_actual)
            del A[0]
            del B[0]
            del C[0]
            i = i + i
            sleep(1)
    def AutomaticoLucesJardin(self):     
        while True:
            print(".")
            horaEncender = str(self.refLucesJardinAutomaticoHoraOn.get())
            
            horaEncenderhora = horaEncender[:2] 
            horaEncenderminuto = horaEncender[3:]
            horaApagar = str(self.refLucesJardinAutomaticoHoraOff.get())
            horaApagarhora = horaApagar[:2] 
            horaApagarminuto = horaApagar[3:]
            h = time.strftime("%H")
            m = time.strftime("%M")
            if(horaEncenderhora == h and horaEncenderminuto == m):
                automatico = self.refLucesJardinAutomatico.get()
                if(automatico == True):
                    self.refJardinActuadores.update({"lucesjardin" : True})
                    print('Activando automaticamente Luces Jardin!')
                    sleep(58)
            sleep(1)

            if(horaApagarhora == h and horaApagarminuto == m):
                automatico = self.refLucesJardinAutomatico.get()
                if(automatico == True):
                    self.refJardinActuadores.update({"lucesjardin" : False})
                    print('Desactivando automaticamente Luces Jardin!')
                    sleep(58)
            sleep(1)

#TIENDA
    #SENSOR
    #Ventana Tienda
    def VentanaTiendaOnOff(self):
        ventana_tienda = VENTANA_TIENDA.is_active
        self.refTiendaSensores.update({"ventanatienda" : ventana_tienda})
        self.refTiendaSensores.update({"dateventanatienda" : hora()})
        estado_modo = self.refModoEstado.get()
        if (VENTANA_TIENDA.is_active == True):
            print('Ventana cerrada')
            #registrandoLogEnBBDD(str(VENTANA_TIENDA.pin),'Ventana cerrada')
            if(estado_modo == "deshabitado"):
                print('Activando socorro por actividad en la Ventana de la tienda')
                self.activandoSocorro()
                self.activandoAlarma('Alerta Ventana','tienda cerrada!')
        else:
            print('Ventana abierta')
            #registrandoLogEnBBDD(str(VENTANA_TIENDA.pin),'Ventana abierta')
            if(estado_modo == "deshabitado"):
                print('Activando socorro por actividad en la Ventana de la tienda')
                self.activandoSocorro()
                self.activandoAlarma('Alerta Ventana','tienda abierta!')
    def lecturaVentanaTienda(self):
        VENTANA_TIENDA.when_pressed = self.VentanaTiendaOnOff
        VENTANA_TIENDA.when_released = self.VentanaTiendaOnOff

    #SENSOR 
    #Puerta garaje
    def PuertaGarajeOnOff(self):
        puerta_garaje = PUERTA_GARAJE.is_active
        self.refTiendaSensores.update({"puertagaraje" : puerta_garaje})
        self.refTiendaSensores.update({"datepuertagaraje" : hora()})
        estado_modo = self.refModoEstado.get()
        if (PUERTA_GARAJE.is_active == True):
            print('Puerta garaje cerrada')
            #registrandoLogEnBBDD(str(PUERTA_GARAJE.pin),'Puerta G. cerrada')
            if(estado_modo == "deshabitado"):
                print('Activando socorro por actividad en el Puerta del garaje')
                self.activandoSocorro()
                self.activandoAlarma('Alerta Puerta','garaje cerrada!')
        else:
            print('Puerta garaje abierta')
            #registrandoLogEnBBDD(str(PUERTA_GARAJE.pin),'Puerta G. abierta')
            if(estado_modo == "deshabitado"):
                print('Activando socorro por actividad en el Puerta del garaje')
                self.activandoSocorro()
                self.activandoAlarma('Alerta Puerta','garaje abierta!')
    def lecturaPuertaGaraje(self):
        PUERTA_GARAJE.when_pressed = self.PuertaGarajeOnOff
        PUERTA_GARAJE.when_released = self.PuertaGarajeOnOff

    #SENSOR
    #Sensor Movimiento Entrada Tienda
    def SensorMovimientoEntradaTiendaOnOff(self):
        sensor_movimiento_entrada_tienda = SENSOR_MOVIMIENTO_ENTRADA_TIENDA.is_active
        self.refTiendaSensores.update({"sensormovimientoentradatienda" : sensor_movimiento_entrada_tienda})
        self.refTiendaSensores.update({"datesensormovimientoentradatienda" : hora()})
        if (SENSOR_MOVIMIENTO_ENTRADA_TIENDA.is_active == False):
            print('Se detecto movimiento en la entrada de la tienda')
            estado_modo = self.refModoEstado.get()
            #if(estado_modo == "deshabitado"):
                #registrandoLogEnBBDD(str(SENSOR_MOVIMIENTO_ENTRADA_TIENDA.pin),'Tienda movimiento')
    def lecturaSensorMovimientoEntradaTienda(self):
        SENSOR_MOVIMIENTO_ENTRADA_TIENDA.when_pressed = self.SensorMovimientoEntradaTiendaOnOff
        SENSOR_MOVIMIENTO_ENTRADA_TIENDA.when_released = self.SensorMovimientoEntradaTiendaOnOff

#HABITACION PRINCIPAL
    #SENSOR
    #Balcon Habitacion Principal
    def BalconHabitacionPrincipalOnOff(self):
        balcon_habitacion_principal = BALCON_HABITACION_PRINCIPAL.is_active
        self.refHabitacionPrincipalSensores.update({"balconhabitacionprincipal" : balcon_habitacion_principal})
        self.refHabitacionPrincipalSensores.update({"datebalconhabitacionprincipal" : hora()})
        if (BALCON_HABITACION_PRINCIPAL.is_active == True):
            print('Balcon puerta cerrada')
            #registrandoLogEnBBDD(str(BALCON_HABITACION_PRINCIPAL.pin),'Puerta B. cerrada')
            estado_modo = self.refModoEstado.get()
            if(estado_modo == "deshabitado"):
                print('Activando socorro por actividad en el Balcon Principal')
                self.activandoSocorro()
                self.activandoAlarma('Alerta Balcon','principal cerrad')
        else:
            print('Balcon puerta abierto')
            #registrandoLogEnBBDD(str(BALCON_HABITACION_PRINCIPAL.pin),'Puerta B. abierta')
            estado_modo = self.refModoEstado.get()
            if(estado_modo == "deshabitado"):
                print('Activando socorro por actividad en el Balcon Principal')
                self.activandoSocorro()
                self.activandoAlarma('Alerta Balcon','principal abiert')
    def lecturaBalconHabitacionPrincipal(self):
        BALCON_HABITACION_PRINCIPAL.when_pressed = self.BalconHabitacionPrincipalOnOff
        BALCON_HABITACION_PRINCIPAL.when_released = self.BalconHabitacionPrincipalOnOff

    #SENSOR
    #Puerta Habitacion Principal
    def PuertaHabitacionPrincipalOnOff(self):
        puerta_habitacion_principal = PUERTA_HABITACION_PRINCIPAL.is_active
        self.refHabitacionPrincipalSensores.update({"puertahabitacionprincipal" : puerta_habitacion_principal})
        self.refHabitacionPrincipalSensores.update({"datepuertahabitacionprincipal" : hora()})
        if (PUERTA_HABITACION_PRINCIPAL.is_active == True):
            print('Puerta habitacion principal cerrada')
            #registrandoLogEnBBDD(str(PUERTA_HABITACION_PRINCIPAL.pin),'Puerta H.P. cerrada')
            estado_modo = self.refModoEstado.get()
            if(estado_modo == "deshabitado"):
                self.activandoSocorro()
                self.activandoAlarma('Alerta Puerta','habitacion cerra')
        else:
            print('Puerta habitacion principal abierta')
            #registrandoLogEnBBDD(str(PUERTA_HABITACION_PRINCIPAL.pin),'Puerta H.P. abierta')
            estado_modo = self.refModoEstado.get()
            if(estado_modo == "deshabitado"):
                self.activandoSocorro()
                self.activandoAlarma('Alerta Puerta','habitacion abier')
    def lecturaPuertaHabitacionPrincipal(self):
        PUERTA_HABITACION_PRINCIPAL.when_pressed = self.PuertaHabitacionPrincipalOnOff
        PUERTA_HABITACION_PRINCIPAL.when_released = self.PuertaHabitacionPrincipalOnOff

#AUTENTIFICACION_DE_USUARIO
    def autentificacionDePassword(self,user,password,referencia):
        resultado = verificando_usuario_contrasena.verificando(user,password)
        self.refCualquierUsuario = db.reference(referencia)
        resultado_estado = resultado["estado"]
        if (resultado_estado == True):
            self.refCualquierUsuario.update({'consultar': True})
        else:
            self.refCualquierUsuario.update({'consultar': False})

    def lecturaAutentificacionPassword(self):
        while True:
            usuarios = self.refUsuario.order_by_key().get()
            num_users = len(usuarios)

            for i in range(num_users) :
                i = i + 1
                buscador = 'usuario_'
                id_string = str(i)
                buscador_completo = buscador + id_string
                datos_usuario = usuarios[buscador_completo]
                consultar = str(datos_usuario['pass'])
                if (consultar != ''):
                    if (consultar != ''):
                        consultar_json = json.loads(consultar)
                        user = consultar_json['usuario']
                        password = consultar_json['contrasena']
                        referencia = 'users/'+ buscador_completo
                        self.autentificacionDePassword(user,password,referencia)
            sleep(0.8)                             
#SOCORRO
    #SENSOR
    #Boton de Panico
    def BotonDePanicoOnOff(self):
        boton_panico = SOCORRO_BOTON_PANICO.is_active
        self.refSocorro.update({"socorro" : boton_panico})
        self.refSocorro.update({"nombre" : ""})
        estado_modo = self.refModoEstado.get()
        estado_modo_bbdd = 'Desarmado'
        if(estado_modo == "deshabitado"):
            estado_modo_bbdd = 'Armado'
        if (SOCORRO_BOTON_PANICO.is_active == True):
            print('Solicitando ayuda')
            sql = "INSERT INTO socorro (s_modo_casa, s_activacion, s_nombre) VALUES (%s, %s, %s)"
            val = (estado_modo_bbdd,"Boton de panico","Tablero principal")
            mycursor.execute(sql, val)
            mydb.commit()
    def lecturaBotonPanico(self):
        SOCORRO_BOTON_PANICO.when_pressed = self.BotonDePanicoOnOff
        

print ('START !')
mensajeBienvenidaGenesis() 
iot = IOT()

#Lecturas Modos de proteccion del hogar
subproceso_cambiandoModos = Thread(target=iot.cambiandoModosAutomatico)
subproceso_cambiandoModos.daemon = True
subproceso_cambiandoModos.start()

#JARDIN
#PerimetroPrincipal
subproceso_lecturaPerimetroM = Thread(target=iot.lecturaPerimetroM)
subproceso_lecturaPerimetroM.daemon = True
subproceso_lecturaPerimetroM.start()
#Lecturas Muro Google Assistant
subproceso_actuadoresLecturasMuro = Thread(target=iot.actuadoresLecturasMuro)
subproceso_actuadoresLecturasMuro.daemon = True
subproceso_actuadoresLecturasMuro.start()
#Lecturas Muro Tablero de Control
subproceso_actuadoresLecturasMuroDos = Thread(target=iot.actuadoresLecturasMuroDos)
subproceso_actuadoresLecturasMuroDos.daemon = True
subproceso_actuadoresLecturasMuroDos.start()
#Recuperando datos de Firebase de los sensores de la Puerta
subproceso_actuadoresLecturasPuerta = Thread(target=iot.actuadoresLecturasPuerta)
subproceso_actuadoresLecturasPuerta.daemon = True
subproceso_actuadoresLecturasPuerta.start()
#Recuperando datos de Firebase del esatdo de las luces del Jardin
subproceso_LecturaLucesJardin = Thread(target=iot.LecturaLucesJardin)
subproceso_LecturaLucesJardin.daemon = True
subproceso_LecturaLucesJardin.start()
#Verificando hora para el encendido automatico de las luces del jardin
subproceso_AutomaticoLucesJardin = Thread(target=iot.AutomaticoLucesJardin)
subproceso_AutomaticoLucesJardin.daemon = True
subproceso_AutomaticoLucesJardin.start()

#TIENDA
#Ventana Tienda
subproceso_lecturaVentanaTienda = Thread(target=iot.lecturaVentanaTienda)
subproceso_lecturaVentanaTienda.daemon = True
subproceso_lecturaVentanaTienda.start()
#Puerta Garaje
subproceso_lecturaPuertaGaraje = Thread(target=iot.lecturaPuertaGaraje)
subproceso_lecturaPuertaGaraje.daemon = True
subproceso_lecturaPuertaGaraje.start()
#Sensor movimiento entrada tienda
subproceso_lecturaSensorMovimientoEntradaTienda = Thread(target=iot.lecturaSensorMovimientoEntradaTienda)
subproceso_lecturaSensorMovimientoEntradaTienda.daemon = True
subproceso_lecturaSensorMovimientoEntradaTienda.start()

#HABITACION PRINCIPAL
#Balcon Habitacion Principal
#subproceso_lecturaBalconHabitacionPrincipal = Thread(target=iot.lecturaBalconHabitacionPrincipal)
#subproceso_lecturaBalconHabitacionPrincipal.daemon = True
#subproceso_lecturaBalconHabitacionPrincipal.start()
#Puerta Habitacion Principal
#subproceso_lecturaPuertaHabitacionPrincipal = Thread(target=iot.lecturaPuertaHabitacionPrincipal)
#subproceso_lecturaPuertaHabitacionPrincipal.daemon = True
#subproceso_lecturaPuertaHabitacionPrincipal.start()

#Usuarios
subproceso_lecturaControlAutentificacion = Thread(target=iot.lecturaAutentificacionPassword)
subproceso_lecturaControlAutentificacion.daemon = True
subproceso_lecturaControlAutentificacion.start()

#Socorro
subproceso_lecturaBotonPanico = Thread(target=iot.lecturaBotonPanico)
subproceso_lecturaBotonPanico.daemon = True
subproceso_lecturaBotonPanico.start()

signal.pause() 
