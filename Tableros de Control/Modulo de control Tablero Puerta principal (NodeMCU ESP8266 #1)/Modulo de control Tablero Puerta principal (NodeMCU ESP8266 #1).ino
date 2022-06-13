#include <protothreads.h>
#include <ArduinoJson.h>
#include <FirebaseESP8266.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <LiquidCrystal_I2C.h>
LiquidCrystal_I2C lcd(0x27, 16, 4);

//Estableciendo parametros estaticos "Firebase"
#define FIREBASE_HOST "genesis-32485-default-rtdb.firebaseio.com"
#define FIREBASE_AUTH "qx1OAastmCfxFRc1kOCkpRyM9YZRbIZM7QWLRuDk"
FirebaseData fbdo1;
FirebaseData fbdo2;
FirebaseData fbdo3;
FirebaseData fbdo4;
FirebaseData fbdo5;
FirebaseData fbdo;

//Estableciendo parametros estaticos "Pines NodeMCU"
#define FinalChapa digitalRead(2)
#define MovUno digitalRead(16)
#define MovDos  digitalRead(0)
#define motor 14
#define chapa 12
#define LedWifi 15 

//Declarando Modos para Pines
//Estableciendo parametros de conexion a Internet
String ssid = "Flia Ramos Pacheco";
String password = "Usuar100";
//String ssid = "Familia_Algaravia";
//String password = "aquilito_italia248";
byte cont = 0;
byte max_intentos = 50;

//Funcion escribir LCD
void imprimir(String a, String b, String c){
    lcd.clear();
    lcd.setCursor (0,0);
    lcd.print(a); 
    lcd.setCursor (0,1);
    lcd.print(b);
    lcd.setCursor (0,2);
    lcd.print(c);
}

//    #   #   #   #   #   #   #   #   #   #   #   #  VOID SETUP  #   #   #   #   #   #    #   #   #   #   #   #   #   #    //

  void setup() {
    pinMode(FinalChapa,INPUT);
    pinMode(MovUno,INPUT);
    pinMode(MovDos,INPUT);    
    pinMode(motor,OUTPUT);
    pinMode(chapa,OUTPUT);
    pinMode(LedWifi,OUTPUT);
  //Inicializando Pantalla LCD
    lcd.init();
    lcd.clear();
    lcd.backlight();

  //Iniciando Comunicacion Serial
    Serial.begin(9600);
    Serial.println("\n");
    
  //Inicializando comunicacion red WiFi
    WiFi.begin(ssid, password);
    imprimir("Conectando WiFi!",". . . . . . "," ");
    delay(3000);
    Serial.print("Conectando..");
    Serial.println("");

  //Conectando WiFi
    while (WiFi.status() != WL_CONNECTED and cont < max_intentos) {
      cont++;
      delay(400);
      digitalWrite(LedWifi,HIGH);
      Serial.print(".");
      delay(400);
      digitalWrite(LedWifi,LOW);
    }
    Serial.println("");

  if (cont < max_intentos) {  //Si se conectó      
      Serial.println("********************************************");
      Serial.print("Conectado a la red WiFi: ");
      Serial.println(WiFi.SSID());
      Serial.print("IP: ");
      Serial.println(WiFi.localIP());
      Serial.print("macAdress: ");
      Serial.println(WiFi.macAddress());
      Serial.println("*********************************************");
      
  }
  else { //No se conectó
      Serial.println("------------------------------------");
      Serial.println("Error de conexion");
      Serial.println("------------------------------------");
      digitalWrite(LedWifi,LOW);
      delay(500);
      digitalWrite(LedWifi,HIGH);
      delay(500);
      imprimir("Importante!!","Fuera de Red","Sin conexion");
      delay(3000);
  }
  if ( WiFi.status() == WL_CONNECTED ){
    digitalWrite(LedWifi,HIGH);
    imprimir("Conectado a red:","WiFi Familia","Algaravia");
    delay(3000);
  }
  
  //Inicializando Firebase
    Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
    imprimir("Inicializando","Firebase","ASISTENTE GENESIS");
    delay(3000);
    
  //Mensaje de Bienvenida
    imprimir("Bienvenid@ a","ASISTENTE GENESIS","Flia Pacheco Herrera");
    delay(3000);
}

//   #   #   #   #   #   #   #   #   #   #   #   #   #   #  FUNCIONES VOID   #   #   #   #   #   #    #   #   #   #   #   #   #   #    //
  //Funcion actualizar Firebase
  void actualizandoFirebase(){
    Firebase.setBool(fbdo3, "/puertaprincipal/contacto_c", digitalRead(2) < 1 ); 
    delay(50);      
    Firebase.setBool(fbdo4, "/puertaprincipal/contacto_m", digitalRead(16) < 1); 
    delay(50);
    Firebase.setBool(fbdo5, "/puertaprincipal/contacto_m_dos", digitalRead(0) < 1);
    delay(50);
  }
  //Funcion Abrir Puerta
  void abrirPuerta(){
    //Anulando cualquier movimiento existente en el Motor
    digitalWrite(motor,LOW);
    imprimir("Abriendo Puerta","en ejecucion.","Despeje el area!");
    Serial.print("Activando chapa");
    Serial.println("");
    delay(1000);
    while(true){
    //while(String(fbdo1.to<const char *>()) == "abrir" ){
         imprimir("Chapa activada",""," ");    
         //Firebase.getString(fbdo1,"/puertaprincipal/chapa");
         digitalWrite(chapa,HIGH);
         if(FinalChapa == HIGH){
           digitalWrite(chapa,LOW);
           imprimir("Puerta abierta","exitosamente!"," ");
           Serial.print("Puerta abierta con exito!");
           Serial.println("");
           delay(1000);
           break;
         }
         delay(200);
    }
    actualizandoFirebase();
    imprimir("Bienvenid@ a","ASISTENTE GENESIS","Flia Pacheco Herrera");
  }

  //Funcion Cerrar Puerta
  void cerrarPuerta(){
    //Anulando cualquier movimiento existente en la Chapa de la puerta
    digitalWrite(chapa,LOW);
    if ((MovUno == LOW) && (MovDos == LOW) && (FinalChapa == HIGH)){
      Firebase.getString(fbdo1,"/puertaprincipal/chapa");
      imprimir("Cerrando Puerta","en ejecucion","Despeje el area!");
      Serial.print("Cerrando puerta..");
      Serial.println("");
      while(true){
      //while(String(fbdo1.to<const char *>()) == "cerrar" ){        
         //Firebase.getString(fbdo1,"/puertaprincipal/chapa");
         digitalWrite(motor,HIGH);
         if(FinalChapa == LOW){ 
           digitalWrite(motor,LOW); 
           imprimir("Puerta cerrada","exitosamente!"," ");
           Serial.print("Puerta cerrada con exito!");
           Serial.println("");
           delay(1000);
           imprimir("Bienvenid@ a","ASISTENTE GENESIS","Flia Pacheco Herrera");
           break;
         }
         else if(((MovUno == HIGH) || (MovDos == HIGH)) && (FinalChapa == HIGH)){
           digitalWrite(motor,LOW); 
           imprimir("Puerta detenida","Despeje el area!"," ");
           Serial.print("Puerta detenida. Despeje el area..!");
           Serial.println("");
           delay(1000);
           for (int i = 40; i > 0; i--) {
              imprimir("Reintentando","clausura de Puerta","en " + String(i) + " segundos");
              delay(1000);
           }
           if(((MovUno == LOW) || (MovDos == LOW)) && (FinalChapa == HIGH)){
              imprimir("Cerrando Puerta","en ejecucion","Despeje el area!");
              Serial.print("Cerrando puerta..");
              Serial.println(""); 
           }
           else{
              imprimir("Por favor","despeje el area!"," ");
           }              
         }
         delay(200);
      }
      actualizandoFirebase();
      imprimir("Bienvenid@ a","ASISTENTE GENESIS","Flia Pacheco Herrera");       
    }
  }

  //Funcion Cerrar Puerta Automaticamente
  void cerrarPuertaAutomaticamente(){
    if (((String(fbdo1.to<const char *>()) == "abrir") || (String(fbdo1.to<const char *>()) == "cerrar")) && (fbdo2.to<bool>() == true)){
      Serial.print("Preparando para cerrar en 20s.");
      Serial.println(""); 
      imprimir("Preparando para","cerrar puerta","... ");
      delay(1000);
      while((String(fbdo1.to<const char *>()) == "abrir") && (fbdo2.to<bool>() == true)){
        for (int i = 20; i > 0; i--) {
          Firebase.getString(fbdo1,"/puertaprincipal/chapa");
          imprimir("Cerrando puerta","automaticamente","en " + String(i) + " segundos");
          delay(1000);
          if(String(fbdo1.to<const char *>()) != "abrir"){
            break;
          }
        }
        Firebase.setString(fbdo1, "/puertaprincipal/chapa", "cerrar");
      }
    }
    actualizandoFirebase();
    imprimir("Bienvenid@ a","ASISTENTE GENESIS","Flia Pacheco Herrera");
  }

//   #   #   #   #   #   #   #   #   #   #   #   #   #  CAMBIOS   #   #   #   #   #   #    #   #   #   #   #   #   #   #   #   #

void inicializandoLogicaPorCambios(){
  //Caso #1 Abrir Puerta
  if ((String(fbdo1.to<const char *>()) == "abrir" ) && (FinalChapa == LOW)){
    Serial.print("Abriendo Puerta.. : Accion# 1.1");
    Serial.println("");
    abrirPuerta();
    delay(150);
  }
  else if ((String(fbdo1.to<const char *>()) == "abrir" ) && (FinalChapa == HIGH) && (fbdo2.to<bool>() == false)){
    imprimir("La puerta ya","se encuentra","abierta");
    Serial.print("Abriendo Puerta.. : Accion# 1.2");
    Serial.println("");
    actualizandoFirebase();
    imprimir("Bienvenid@ a","ASISTENTE GENESIS","Flia Pacheco Herrera"); 
    delay(150);
  }
  //Caso #2 Cerrar Puerta automaticamente
  else if ((String(fbdo1.to<const char *>()) == "abrir" ) && (FinalChapa == HIGH) && (fbdo2.to<bool>() == true)){
    if (FinalChapa == HIGH){
        Serial.print("Cerrando puerta automaticamente : Accion# 2");
        Serial.println("");
        cerrarPuertaAutomaticamente();
        delay(150);
    }
  }
  //Caso #3 Cerrar Puerta
  else if ((String(fbdo1.to<const char *>()) == "cerrar") && (fbdo2.to<bool>() == false) && (FinalChapa == HIGH)) {
    Serial.print("Cerrando Puerta.. : Accion#3 ");
    Serial.println("");
    cerrarPuerta();
    delay(150);
  }
  //Caso #4 Cerrar Puerta
  else if ((String(fbdo1.to<const char *>()) == "cerrar" ) && (fbdo2.to<bool>() == true) && (FinalChapa == HIGH)){
    Serial.print("Cerrando Puerta.. : Accion#4 ");
    Serial.println("");
    cerrarPuerta();
    delay(150);
  }
}

//    #   #   #   #   #   #   #   #   #   #   #   #   #   #   #   #   #  VOID LOOP  #   #   #   #   #   #    #   #   #   #   #   #   #   #    //

  void loop() {
      
    //Pidiendo datos a Firebase
    imprimir("Actualizando cambios","en Firebase para","ASISTENTE GENESIS");
    actualizandoFirebase();
    delay(1000);
    Firebase.getString(fbdo1, "/puertaprincipal/chapa");
    Firebase.getBool(fbdo2, "/puertaprincipal/automatic");
    Firebase.getBool(fbdo3, "/puertaprincipal/contacto_c");
    Firebase.getBool(fbdo4, "/puertaprincipal/contacto_m");
    Firebase.getBool(fbdo5, "/puertaprincipal/contacto_m_dos");
    
    //INF SENSORES LOCAL
    int estadoMovUno = MovUno;
    int estadoMovDos = MovDos;
    int estadoFinalChapa = FinalChapa;
    
    int cambiosEstadoMovUno[2];
    int cambiosEstadoMovDos[2];
    int cambiosEstadoFinalChapa[2];
    int y = 0;

    memset(cambiosEstadoMovUno, 0, 2);
    memset(cambiosEstadoMovDos, 0, 2);
    memset(cambiosEstadoFinalChapa, 0, 2);
    y = 0;

    cambiosEstadoMovUno[y] = estadoMovUno;
    cambiosEstadoMovDos[y] = estadoMovDos;
    cambiosEstadoFinalChapa[y] = estadoFinalChapa;
    delay(800);
    
    // INF SENSORES FIREBASE
    String cambiosChapa[2];
    bool cambiosAutomatic[2];
    bool cambiosFinalChapa[2];
    bool cambiosMovimientoUno[2];
    bool cambiosMovimientoDos[2];
    int i = 0;
    
    memset(cambiosChapa, 0, 2);
    memset(cambiosAutomatic, 0, 2);
    memset(cambiosFinalChapa, 0, 2);
    memset(cambiosMovimientoUno, 0, 2);
    memset(cambiosMovimientoDos, 0, 2);
    i=0;
  
    cambiosChapa[i] = String(fbdo1.to<const char *>());
    cambiosAutomatic[i] = fbdo2.to<bool>();
    cambiosFinalChapa[i] = fbdo3.to<bool>();
    cambiosMovimientoUno[i] = fbdo4.to<bool>();
    cambiosMovimientoDos[i] = fbdo5.to<bool>();

    actualizandoFirebase();
    delay(1000);
    imprimir("Bienvenid@ a","ASISTENTE GENESIS","Flia Pacheco Herrera");
    inicializandoLogicaPorCambios();
    delay(1000);    
    
  while(true){
      //actualizandoFirebase();
      //Logica para comunicar cambios hacia Firebase
      int cambioEstadoMovUno = MovUno;
      int cambioEstadoMovDos = MovDos;
      int cambioEstadoFinalChapa = FinalChapa;
      cambiosEstadoMovUno[y+1] = cambioEstadoMovUno;
      cambiosEstadoMovDos[y+1] = cambioEstadoMovDos;
      cambiosEstadoFinalChapa[y+1] = cambioEstadoFinalChapa;
      int cambioEstadoMovUnoMemoria = MovUno;
      int cambioEstadoMovDosMemoria = MovDos;
      int cambioEstadoFinalChapaMemoria = FinalChapa;
      delay(500);
      
      //Logica para detectar cambios desde Firebase
      Firebase.getString(fbdo1, "/puertaprincipal/chapa");  
      Firebase.getBool(fbdo2, "/puertaprincipal/automatic");
      Firebase.getBool(fbdo3, "/puertaprincipal/contacto_c");
      Firebase.getBool(fbdo4, "/puertaprincipal/contacto_m");
      Firebase.getBool(fbdo5, "/puertaprincipal/contacto_m_dos");

      cambiosChapa[i+1] = String(fbdo1.to<const char *>());      
      cambiosAutomatic[i+1] = fbdo2.to<bool>();
      cambiosFinalChapa[i+1] = fbdo3.to<bool>();
      cambiosMovimientoUno[i+1] = fbdo4.to<bool>();
      cambiosMovimientoDos[i+1] = fbdo5.to<bool>();

      delay(500);      
      String cambiosChapaMemoria = String(fbdo1.to<const char *>());
      bool cambiosAutomaticMemoria = fbdo2.to<bool>();
      bool cambiosFinalChapaMemoria = fbdo3.to<bool>();
      bool cambiosMovimientoUnoMemoria = fbdo4.to<bool>();
      bool cambiosMovimientoDosMemoria = fbdo5.to<bool>();
      delay(500);   
              
      //**      
      if((cambiosEstadoMovUno[y] != cambiosEstadoMovUno[y+1]) || (cambiosEstadoMovDos[y] != cambiosEstadoMovDos[y+1]) || (cambiosEstadoFinalChapa[y] != cambiosEstadoFinalChapa[y+1]) ){      
        Serial.print("%");
        Serial.println("");
        actualizandoFirebase();
        memset(cambiosEstadoMovUno, 0, 2);
        memset(cambiosEstadoMovDos, 0, 2);
        memset(cambiosEstadoFinalChapa, 0, 2);     
        cambiosEstadoMovUno[y] = cambioEstadoMovUnoMemoria;
        cambiosEstadoMovDos[y] = cambioEstadoMovDosMemoria;
        cambiosEstadoFinalChapa[y] = cambioEstadoFinalChapaMemoria;
        delay(100);              
      }
      
      //**Si el proceso NO es AUTOMATICO
      if(fbdo2.to<bool>() == false){
        if((cambiosChapa[i] != cambiosChapa[i+1]) || (cambiosAutomatic[i] != cambiosAutomatic[i+1])){   
          Serial.print("*");
          Serial.println("");
          memset(cambiosChapa, 0, 2);
          memset(cambiosAutomatic, 0, 2);
          memset(cambiosFinalChapa, 0, 2);
          memset(cambiosMovimientoUno, 0, 2);
          memset(cambiosMovimientoDos, 0, 2);        
          cambiosChapa[i] = cambiosChapaMemoria;
          cambiosAutomatic[i] = cambiosAutomaticMemoria;
          cambiosFinalChapa[i] = cambiosFinalChapaMemoria;
          cambiosMovimientoUno[i] = cambiosMovimientoUnoMemoria;
          cambiosMovimientoDos[i] = cambiosMovimientoDosMemoria;
          inicializandoLogicaPorCambios();
          delay(100);      
        }        
      }
      
      //**Si el proceso SI es AUTOMATICO
      if(fbdo2.to<bool>() == true){
        if((cambiosChapa[i] != cambiosChapa[i+1]) || (cambiosAutomatic[i] != cambiosAutomatic[i+1]) || (cambiosFinalChapa[i] != cambiosFinalChapa[i+1]) || (cambiosMovimientoUno[i] != cambiosMovimientoUno[i+1]) || (cambiosMovimientoDos[i] != cambiosMovimientoDos[i+1])){     
          Serial.print("*");
          Serial.println("");
          memset(cambiosChapa, 0, 2);
          memset(cambiosAutomatic, 0, 2);
          memset(cambiosFinalChapa, 0, 2);
          memset(cambiosMovimientoUno, 0, 2);
          memset(cambiosMovimientoDos, 0, 2);        
          cambiosChapa[i] = cambiosChapaMemoria;
          cambiosAutomatic[i] = cambiosAutomaticMemoria;
          cambiosFinalChapa[i] = cambiosFinalChapaMemoria;
          cambiosMovimientoUno[i] = cambiosMovimientoUnoMemoria;
          cambiosMovimientoDos[i] = cambiosMovimientoDosMemoria;
          inicializandoLogicaPorCambios();
          delay(100);      
        }        
      }  

      else{
        memset(cambiosChapa, 0, 2);
        memset(cambiosAutomatic, 0, 2);
        memset(cambiosFinalChapa, 0, 2);
        memset(cambiosMovimientoUno, 0, 2);
        memset(cambiosMovimientoDos, 0, 2);
        memset(cambiosEstadoMovUno, 0, 2);
        memset(cambiosEstadoMovDos, 0, 2);
        memset(cambiosEstadoFinalChapa, 0, 2);
        cambiosChapa[i] = cambiosChapaMemoria;
        cambiosAutomatic[i] = cambiosAutomaticMemoria;
        cambiosFinalChapa[i] = cambiosFinalChapaMemoria;
        cambiosMovimientoUno[i] = cambiosMovimientoUnoMemoria;
        cambiosMovimientoDos[i] = cambiosMovimientoDosMemoria;
        cambiosEstadoMovUno[y] = cambioEstadoMovUnoMemoria;
        cambiosEstadoMovDos[y] = cambioEstadoMovDosMemoria;
        cambiosEstadoFinalChapa[y] = cambioEstadoFinalChapaMemoria;
        delay(1500);
        Serial.print(".");
        Serial.println("");
      }
    }
  }
 



