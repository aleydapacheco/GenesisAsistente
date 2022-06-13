import requests
import json

######################### ARQUITECTURA API_REST PARA LA COMUNICACION DE SISTEMAS PHP Y PYTHON ############################

def verificando(contrasena):
    API_ENDPOINT = "http://localhost/vesta_bbdd/comparando_contrasenas.php"
    data = {
            'contrasena' : contrasena
            }
    #POST
    r = requests.post(url = API_ENDPOINT, data = data)
    res = json.loads(r.text)
    return(res)
    
#objeto_respuesta = verificando(1234)
#print(objeto_respuesta["nombre"])
#print(objeto_respuesta["estado"])

