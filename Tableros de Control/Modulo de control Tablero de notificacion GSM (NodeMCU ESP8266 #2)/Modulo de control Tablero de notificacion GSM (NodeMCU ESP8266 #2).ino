//Módulo de notificacion GSM
//Librerias necesarias para el funcionamiento del programa
#include <ArduinoJson.h>
#include <FirebaseESP8266.h>
#include <ESP8266WiFi.h>
#include <SoftwareSerial.h>
#include <LiquidCrystal_I2C.h>
LiquidCrystal_I2C lcd(0x27, 16, 2);
//Estableciendo parametros estaticos "SIM800L"
#define rxPin 2 //Modulo GSM  RX pin de racepcion NodeMCU D3 -> 2
#define txPin 0 //Modulo GSM  TX pin de transmision NodeMCU D4 -> 0
SoftwareSerial sim800(rxPin,txPin);
//Estableciendo parametros estaticos "Firebase"
#define FIREBASE_HOST "genesis-32485-default-rtdb.firebaseio.com"
#define FIREBASE_AUTH "qx1OAastmCfxFRc1kOCkpRyM9YZRbIZM7QWLRuDk"
//Estableciendo pines ESP8266
#define LedWifi 14 
#define LedLlamada 12
#define LedMensaje 15
#define LedBusquedaAdmis 3
#define boton 13

//Estableciendo parametros de conexion a Firebase
FirebaseData fbdoUsuario;
FirebaseJson jValUsuario;
FirebaseData fbdo1;
FirebaseData fbdo2;

//Estableciendo parametros de conexion a Internet
String ssid = "Flia Ramos Pacheco";
String password = "Usuar100";
//String ssid = "Familia_Algaravia";
//String password = "aquilito_italia248";
byte cont = 0;
byte max_intentos = 50;

bool remitente;
String autorr;

int _timeout;
String _buffer;

//Estableciendo parametros de los numeros de telefono celular de los Administradores
String numeros[50];
String autor[50];
int m=0;
int i=0;
int numeroAdministradores=0;

//Funcion escribir en pantalla LCD
void imprimir(String a, String b){
    lcd.clear();
    lcd.setCursor (0,0);
    lcd.print(a); 
    lcd.setCursor (0,1);
    lcd.print(b);
}

void setup() {
  //Definiendo estado de pines a utilizar
  pinMode(boton, INPUT);
  pinMode(LedWifi, OUTPUT); 
  pinMode(LedLlamada, OUTPUT);
  pinMode(LedMensaje, OUTPUT); 
  pinMode(LedBusquedaAdmis, OUTPUT); 

  //Inicializando Pantalla LCD
  lcd.begin(16,2);
  lcd.init();
  lcd.clear();
  lcd.backlight();
    
  //Inicializando comunicacion serial
  Serial.begin(9600);
  _buffer.reserve(50);
  Serial.println("Inicio de sistema!");
  delay(500);
  imprimir("Inicializando","Sistema");
  delay(1000);
  
  //Inicializando comunicacion red WiFi
  WiFi.begin(ssid, password);
  delay(3000);
  Serial.print("Conectando..");
  Serial.println("");
  imprimir("Inicializando","conexion Wifi...");
  delay(200);

  //Conectando WiFi
  while (WiFi.status() != WL_CONNECTED and cont < max_intentos) {
    cont++;
    delay(300);
    digitalWrite(LedWifi,HIGH);
    Serial.print(".");
    delay(300);
    digitalWrite(LedWifi,LOW);
    Serial.println("");
  }
  
  //Si la conexión se establece  
  if (cont < max_intentos) {      
    Serial.println("********************************************");
    Serial.print("Conectado a la red WiFi: ");
    Serial.println(WiFi.SSID());
    Serial.print("IP: ");
    Serial.println(WiFi.localIP());
    Serial.print("macAdress: ");
    Serial.println(WiFi.macAddress());
    Serial.println("*********************************************");
  }

  //Si la conexión no se establece
  else {
    Serial.println("------------------------------------");
    Serial.println("Error de conexion");
    Serial.println("------------------------------------");
    digitalWrite(LedWifi,LOW);
    delay(200);
    digitalWrite(LedWifi,HIGH);
    delay(200);
    imprimir("Error de","conexion Wifi");
    delay(2000);
  }

  //Imprimiendo en pantalla el estado de la conexión.
  if ( WiFi.status() == WL_CONNECTED ){
    digitalWrite(LedWifi,HIGH);
    imprimir("Conectado a red:","Flia. Algaravia");
    delay(3000);
  }
  
  //Inicializando Firebase
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  imprimir("Inicializando","Firebase");
  delay(3000);

  //Inicializando Modulo SIM800L. Retraso de 7 segundos para permitir que al modulo capturar senial
  sim800.begin(9600);
  Serial.println("Esperando conexion a RED SIM800L");
  imprimir("Capturando senal","red SIM800L");
  delay(7000);
  
  //Vaceando Arrays
  memset(autor, 0, 100);
  memset(numeros, 0, 100);
  m=0;
  
  //Mensaje de Bienvenida
  imprimir("Bienvenid@ flia","Pacheco Herrera");
  delay(10000);
}

//Funcion obteniendo Numeros de los Administradores
void obteniendoNumerosAdministradores(){
  delay(2000);
  Serial.print("Obteniendo numeros administradores!");
  Serial.println("");
  digitalWrite(LedBusquedaAdmis,HIGH);
  int numeroDeUsuarios = 100;
  imprimir("Buscando datos","Administradores");
  delay(2000);
    
  for (int n = 1; n<numeroDeUsuarios; n++) {
     //Armando buscador 
     String buscador = "/users/usuario_";
     String buscadorId;
     buscadorId = String(n); 
     String buscadorCompleto = buscador + buscadorId;
      
     //Buscando usuario mediante la construccion del ID
     Firebase.RTDB.getJSON(&fbdoUsuario, buscadorCompleto, &jValUsuario);
     delay(200);
      
     //Parseando la informacion recuperada
     StaticJsonBuffer<600> jsonBuffer;
     JsonObject& usuario = jsonBuffer.parseObject(fbdoUsuario.to<const char *>());
      
     //Almacenando temporalmente la informacion parseada
     const char* nombre = usuario["name"];
     const char* rol = usuario["rol"];
     int cell = usuario["cell"];
     
     //Almacenando en un arreglo la informacion parseada
     if(usuario["rol"] == "Administrador"){
       numeros[m] = String(cell);
       autor[m] = String(nombre);
       m=m+1;      
     }
  
     //Almacenando en un arreglo la informacion parseada
     String resultadoConsulta = String(fbdoUsuario.to<const char *>());
     if(resultadoConsulta == "null"){
       Serial.println("");
       Serial.print("Busqueda finalizada!. ");
       delay(500);
       imprimir("Busqueda","finalizada!");
       delay(1000);
       break;
     }
     Serial.println("");
     Serial.print("Usuario: " + buscadorId + " -> Rol: " + rol);
     delay(200);
   }

   Serial.print("El numero de Administradores es: " + String(m) + ". Los cuales son: ");
   imprimir("Administradores","detectados " + String(m));
   delay(1000);
   Serial.println("");
    
   for (int o=0; o<m ; o++){
     Serial.println("");
     Serial.print("Usuario: " + autor[o] + ". Numero celular:  " + numeros[o]);
     delay(500);
     imprimir("User: " + autor[o],"Cell: " + numeros[o]);
     delay(1000);
   }
  digitalWrite(LedBusquedaAdmis,LOW);
}

//Funcion leer puerto serial
String _readSerial() {
  _timeout = 0;
  while (!sim800.available() && _timeout < 25000)
  {
    delay(13);
    _timeout++;
  }
  if (sim800.available()) {
    return sim800.readString();
  }
}

//Funcion Enviar mensaje
void SendMessage(String num){
  num = "+591" + num;
  delay(2000);
  digitalWrite(LedMensaje,HIGH);
  Serial.println ("Enviando mensaje");
  sim800.println("AT+CMGF=1"); //Sets the GSM Module in Text Mode
  delay(2000);
  Serial.println ("Ingresando numero de celular para enviar SMS a: " + num);
  sim800.println("AT+CMGS=\"" + num + "\"\r");
  delay(2000);
  String SMS;
  if ((remitente == false) && (autorr != "")){
    SMS = "Alerta en casa! Atte:" + autorr;
  }
  else if ((remitente == true) && (autorr == "")){
    SMS = "Alerta en casa! Atte:Genesis";
  }
  Serial.println (SMS);
  delay(2000);
  sim800.println(SMS);
  delay(2000);
  sim800.println((char)26);// ASCII code of CTRL+Z
  delay(2000);
  Serial.println ("Mensaje de texto enviado a: " + num);
  delay(1000);
  digitalWrite(LedMensaje,LOW);
  _buffer = _readSerial();
  delay(2000);
}

//Funcion realizar llamada
void callnumeroCelular(String num) {
  num = "+591" + num;
  digitalWrite(LedLlamada,HIGH);
  delay(2000);
  Serial.println ("Iniciando una llamada al numero: " + num);
  delay(1000);
  sim800.print(F("ATD"));
  sim800.print(num);
  sim800.print(F(";\r\n"));
  //se esperara 8 segundos para que el modulo localice al Usuario y 8 para dejar una llamada perdida;
  delay(15000);
  sim800.print(F("ATH"));
  sim800.print(F(";\r\n"));
  delay(1000);
  _buffer = _readSerial();
  Serial.println ("Cancelando Llamada al numero: " + num);
  Serial.println(_buffer);
  delay(1000);
  digitalWrite(LedLlamada,LOW);
}

//Funcion para notificar a los usuarios
void notificar(){
  if((fbdo1.to<bool>() == true) || (digitalRead(boton) == HIGH)){
     lcd.backlight();
     obteniendoNumerosAdministradores();
     delay(2000);
     for (i=0; i<m; i++) {
       if(numeros[i] != ""){
         delay(1000);
         Serial.println("");
         Serial.println ("Enviando mensaje a: " + autor[i] + " con el numero de celular " + numeros[i] + ".");
         imprimir("Enviando mensaje","a: " + autor[i] );
         delay(2000); 
         SendMessage(numeros[i]);
         delay(2000); 
         Serial.println ("Llamando a: " + autor[i] + " con el numero de celular " + numeros[i] + ".");
         imprimir("Llamando a:",autor[i]);
         delay(2000);       
         callnumeroCelular(numeros[i]);
         delay(2000);
        }
       else{
         Serial.println ("Se llamo a todos los usuarios!!");
         Serial.println("");
         imprimir("Se llamo a todos","los Admins.");
         break;
       }
     }
     Firebase.setBool(fbdo1,"/socorro/socorro", false);
     Firebase.setString(fbdo2,"/socorro/nombre", "");
     autorr = "";
     imprimir("Notificaciones","finalizadas! :)");
     delay(3000);
     imprimir("Bienvenid@ flia","Pacheco Herrera");
  }
}

void loop() {
  //Reconectando Internet
  if(WiFi.status() != WL_CONNECTED){
     while (WiFi.status() != WL_CONNECTED) {
        cont++;
        digitalWrite(LedWifi,LOW);
        delay(500);
        digitalWrite(LedWifi,HIGH);
        delay(500);
        Serial.print(".");
        delay(1000);
        imprimir("Reconectando","Internet...");
        if (WiFi.status() == WL_CONNECTED){
          digitalWrite(LedWifi,LOW);
          imprimir("Conectado a red:","Flia. Algaravia");
          break;
        }
     }
     delay(3000);
  }
  
  //Verificando disponibilidad de la conexion del modulo sim800L
  if (sim800.available() > 0)
    Serial.write(sim800.read());
    
  //Guardando en lec_boton el estado del BOTON
  int lec_boton = digitalRead(boton);

  //Proceso de deteccion de cambios de variable "socorro" situada en Firebase
  //Pidiendo datos a Firebase
  Firebase.getBool(fbdo1, "/socorro/socorro");
    
  //INF SENSORES LOCAL
  int cambiosEstadoBoton[2];
  bool cambiosSocorro[2]; 
  int y = 0;

  memset(cambiosEstadoBoton, 0, 2);
  memset(cambiosSocorro, 0, 2);
  y = 0;

  cambiosEstadoBoton[y] = digitalRead(boton);
  cambiosSocorro[y] = fbdo1.to<bool>();
  delay(40);

  while(true){
    //Logica para comunicar cambios hacia Firebase
    cambiosEstadoBoton[y+1] = digitalRead(boton);
    int cambioEstadoBotonMemoria = digitalRead(boton);
    delay(500);

    //Logica para detectar cambios desde Firebase
    Firebase.getBool(fbdo1, "/socorro/socorro");
    cambiosSocorro[y+1] = fbdo1.to<bool>();
    bool cambioSocorroMemoria = fbdo1.to<bool>();
    delay(500);  

    if(cambiosEstadoBoton[y] != cambiosEstadoBoton[y+1]){
      Serial.print("Cambio detectado desde el boton o entradas adyacentes fisicas!");
      Serial.println("");
      if((fbdo1.to<bool>() == true) || (digitalRead(boton) == HIGH)){
        imprimir("Solicitando ayud","desde casa!");
      }
      remitente = true;
      autorr = "";
      notificar();
      memset(autor, 0, 100);
      memset(numeros, 0, 100);
      m=0;
      memset(cambiosEstadoBoton, 0, 2);
      memset(cambiosSocorro, 0, 2);
      cambiosEstadoBoton[y] = cambioEstadoBotonMemoria;
      cambiosSocorro[y] = cambioSocorroMemoria;
      delay(50);
    }
    if(cambiosSocorro[y] != cambiosSocorro[y+1]){
      Serial.print("Cambio detectado desde Firebase");
      Serial.println("");
      Firebase.getString(fbdo2, "/socorro/nombre");
      autorr = String(fbdo2.to<const char *>());
      remitente = false;
      if((fbdo1.to<bool>() == true) || (digitalRead(boton) == HIGH)){
        imprimir("User " + autorr,"Solicita ayuda!");
      }
      notificar();
      memset(autor, 0, 100);
      memset(numeros, 0, 100);
      m=0;
      memset(cambiosEstadoBoton, 0, 2);
      memset(cambiosSocorro, 0, 2);
      cambiosEstadoBoton[y] = cambioEstadoBotonMemoria;
      cambiosSocorro[y] = cambioSocorroMemoria;
      delay(40);
    }
    else{
      Serial.print(".");
      Serial.println("");
      memset(cambiosEstadoBoton, 0, 2);
      memset(cambiosSocorro, 0, 2);
      cambiosEstadoBoton[y] = cambioEstadoBotonMemoria;
      cambiosSocorro[y] = cambioSocorroMemoria;
      delay(2500);
    }
  }
}
