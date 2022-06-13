#!/usr/bin/env python
import smbus
import sys
import time
import I2C_LCD_driver


class MyKeyboard:

  #Modificado por Juan A. Villalpando http://kio4.com
  KeyPadTable= [['D','C','B','A'] , ['#','9','6','3'], ['0','8','5','2'], ['*','7','4','1']]
  RowID=[0,0,0,0,0,0,0,4,0,0,0,3,0,2,1,0]

  CurrentKey=None

  def __init__(self,I2CBus=1, I2CAddress=0x21):
    self.I2CAddress = I2CAddress
    self.I2CBus = I2CBus
    self.bus = smbus.SMBus(self.I2CBus)
    self.bus.write_byte(self.I2CAddress,0xff)
  
  def ReadRawKey(self):
    OutPin= 0x10
    for Column in range(4):
      self.bus.write_byte(self.I2CAddress,~OutPin)
      key = self.RowID[self.bus.read_byte(self.I2CAddress) & 0x0f]
      if key >0 :
        return self.KeyPadTable[key-1][Column]
      OutPin = OutPin * 2
    return None

  def ReadKey(self):
   LastKey= self.CurrentKey;
   while True:
    NewKey= self.ReadRawKey()
    if  NewKey != LastKey:
      time.sleep(0.01)
      LastKey= NewKey
    else:
      break

   if LastKey==self.CurrentKey:
     return None
   self.CurrentKey=LastKey
   return self.CurrentKey

def mandar_password(sirena):

  test = MyKeyboard()
  mylcd = I2C_LCD_driver.lcd()
  password = ""
  new_pass = ""
  a ="*"
  mylcd.lcd_display_string("INTRODUZCA PIN:", 1) 

  while True:
    if (sirena == True):
      V = test.ReadKey()
          
      if V != None:
        password = password + V
        mylcd.lcd_clear()

        if V != "#":
          new_pass = new_pass + a
          mylcd.lcd_clear()
          mylcd.lcd_display_string("INTRODUZCA PIN:", 1)
          mylcd.lcd_display_string(new_pass, 2)

        if V == '#':
          password_recortado = password.rstrip(password[-1])
          return(password_recortado)

      else:
        time.sleep(0.01)
  
    elif (sirena == False):
      mylcd.lcd_clear()
      print('El teclado dejo de funcionar!')
      return('')

