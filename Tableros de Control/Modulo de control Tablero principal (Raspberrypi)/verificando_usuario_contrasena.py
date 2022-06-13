import requests
import json

######################### ARQUITECTURA API_REST PARA LA COMUNICACION DE SISTEMAS PHP Y PYTHON ############################

def verificando(usuario,contrasena):
    API_ENDPOINT = "http://localhost/vesta_bbdd/comparando_usuarios_contrasenas.php"
    data = {
            'usuario' : usuario,
            'contrasena' : contrasena
            }
    #POST
    r = requests.post(url = API_ENDPOINT, data = data)
    print(r.content)
    res = json.loads(r.text)
    return(res)

verificando('Belen','123456')
#objeto_respuesta = verificando(1234)
#print(objeto_respuesta["nombre"])
#print(objeto_respuesta["estado"])