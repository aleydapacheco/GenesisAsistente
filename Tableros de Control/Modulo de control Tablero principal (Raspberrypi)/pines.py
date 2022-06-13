from time import sleep
from gpiozero import LED, Button

CHAPA = LED(5)
MOTOR = LED(6)
SIRENA = LED(19)
def imprimir():
    print('was pressed')
    sleep(2)
def imprimirno():
    print('no')
    sleep(2)
button = Button(24)
while True:
    button.when_pressed = imprimir()
    button.when_released = imprimirno() 



