#TODO: install keyboard and colorama on server
#no GPIO library, only gpiozero
import time
from colorama import Fore, Style, Back
import traceback
import keyboard
import Adafruit_PCA9685
from gpiozero import Motor, Servo
import threading
from threading import Thread
import socket
import json

##NETWORKING
bufferSize = 1024
# DO NOT HARD CODE THIS. WE ARE DOING SO FOR TESTING PURPOSES. BE WARNED
HOSTNAME = "10.147.18.228"
PORT = 9696
#PORT = 5500
logs = True #Have logs

pwm = Adafruit_PCA9685.PCA9685()

#TODO: adjust these
servo_pin = 15 # servo connect to PWM 15
RIGHT = 465 # Steer servo car turn right
CENTER= 425 # Steer servo car go forward
LEFT = 385 # Steer servo car turn left
move_speed = 4000  # Max pulse length out of 4096
pwm.set_pwm_freq(60) # Set pvm frequency to 60hz, good for servos.

IN1 = 23  # right motor direction pin
IN2 = 24  # right motor direction pin
IN3 = 27  # left motor direction pin
IN4 = 22  # left motor direction pin

right_motor = Motor(forward=IN1, backward=IN2) # Create Motor instances
left_motor = Motor(forward=IN3, backward=IN4)

def changespeed(speed):
   pwm.set_pwm(0, 0, speed)  # ENA
   pwm.set_pwm(1, 0, speed)  # ENB

def stopcar():
   right_motor.stop()
   left_motor.stop()
   changespeed(0)

def forward():
   right_motor.forward()
   left_motor.forward()
   changespeed(move_speed)

def backward():
   right_motor.backward()
   left_motor.backward()
   changespeed(move_speed)

def steer(angle):
   if angle > RIGHT:
       angle = RIGHT
   if angle < LEFT:
       angle = LEFT
   pwm.set_pwm(servo_pin, 0, angle)
def stop_server_event_handler(event):
   if event.event_type == keyboard.KEY_DOWN:
        if keyboard.is_pressed('ctrl+alt+q'):
            server_running = False

# start socket
server = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
server.bind((HOSTNAME, PORT)) # bind server
print(Fore.GREEN + Back.YELLOW + "Server up and listening"  + Style.RESET_ALL) if logs else None
server_running = True # run server

def start():
   print(Fore.RED + f"Server is listening"  + Style.RESET_ALL) if logs else None
   global server_running
   print(server_running)
   #UDP, no need to establish connection
   while server_running:
       data, address = server.recvfrom(bufferSize)
       if logs:
           print(f"Command Received from:  {address[0]}") if logs else None
       # handles data
       thread = threading.Thread(target=handle_client, args=(data, address))
       #single thread for now...
       thread.start()
       # way to stop server
       if keyboard.is_pressed('x'):
           server_running = False
   print("Thread stopped, start method broken out of") if logs else None




def handle_client(data, address):
   print(f"New Data Packet... {json.loads(data)}, from {address}") if logs else None
   # this data is pickled, we need to unpickle it
   data = json.loads(data)
   print(data["command"])
   if(data["command"] == "forward"):
       print("Moving Forward") if logs else None
       forward()
   elif(data["command"] == "backward"):
       backward()
       print("Moving backward") if logs else None
   elif(data["command"] == "stopcar"):
      print("Stopcar")
      stopcar()
   else:
      #default
      stopcar()




try:
   print("Starting up server...") if logs else None
   keyboard.on_press(stop_server_event_handler)
   t1 = threading.Thread(target=start)
   t1.daemon = True
   t1.start()
   print("\nStarted main thread") if logs else None
   # Magic: t1.join waits for this thread to end
   keyboard.wait('ctrl+alt+q')
except KeyboardInterrupt:
   print("\nExiting program due to keyboard interrupt... not good") if logs else None
except:
   traceback.print_exc()
finally:
   # Clean up GPIO or any other resources here
   print("\nDoing Cleanup") if logs else None
   server_running = False
   stopcar() # Stops car
   pwm.set_pwm(servo_pin, 0, 0) # stops pwm
   print(Fore.GREEN + Back.YELLOW + "\nFinished cleanup" + Style.RESET_ALL) if logs else None
   print(t1.is_alive())