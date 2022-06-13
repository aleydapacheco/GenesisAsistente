import requests
def captura():
    responses = requests.get('http://localhost:8080/0/action/snapshot')
    print('Captura del muro exitosa!')