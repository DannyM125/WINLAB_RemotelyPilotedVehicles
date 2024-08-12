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
import cv2
import base64
import board
import busio
from adafruit_servokit import ServoKit
##NETWORKING
bufferSize = 1024
# DO NOT HARD CODE THIS. WE ARE DOING SO FOR TESTING PURPOSES. BE WARNED
HOSTNAME = "10.147.18.228"
PORT = 9696
logs = True #Have logs

# 10.147.18.171
# CHOSTNAME = "10.147.18.171"
# CPORT = 5501

pwm = Adafruit_PCA9685.PCA9685()

#TODO: adjust these
servo_pin = 15 # servo connect to PWM 15
RIGHT = 465 # Steer servo car turn right
CENTER= 425 # Steer servo car go forward
LEFT = 385 # Steer servo car turn left
move_speed = 4000  # Max pulse length out of 4096
# pwm.set_pwm_freq(60) # Set pvm frequency to 60hz, good for servos.

# pwm.set_pwm(servo_pin, 0, LEFT)
# time.sleep(1)
# pwm.set_pwm(servo_pin, 0, RIGHT)
# time.sleep(1)
IN1 = 23  # right motor direction pin
IN2 = 24  # right motor direction pin
IN3 = 27  # left motor direction pin
IN4 = 22  # left motor direction pin

right_motor = Motor(forward=IN1, backward=IN2) # Create Motor instances
left_motor = Motor(forward=IN3, backward=IN4)

# dealing with i2c
i2c = busio.I2C(board.SCL, board.SDA)
cam_motor = ServoKit(channels=16, i2c=i2c, address=0x40)
cam_motor_pin = 14
steering_motor = ServoKit(channels=16, i2c=i2c)
steering_motor_pin = 15
steering_motor.servo[steering_motor_pin].angle = 120
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

# start socket (('', port))
server = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
# don't do hostname, instead do
server.bind((HOSTNAME, PORT)) # bind server
print(Fore.GREEN + Back.YELLOW + "Server up and listening"  + Style.RESET_ALL) if logs else None
server_running = True # run server

def start():
   print(Fore.RED + f"Server is listening"  + Style.RESET_ALL) if logs else None
   global server_running
   print(server_running) if logs else None
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


# def camStream():
   # frames = 0
   # cam = cv2.VideoCapture(0)
   # cam.set(3, 640)
   # cam.set(4, 480)
   # print("Starting cam server..")
   # while server_running:
      # # read the frame
      # ret, frame = cam.read()
      # # create a buffer and encode frame as jpeg
      # ret, buffer = cv2.imencode(".jpg", frame)
      # if not ret:
         # print("Error: not finding camera or something else. Make sure it on - you don't want to spend 3 hours debugging it. This might not fire off because you were too lazy to implement a try/except block.")
      # encoded_string = base64.b64encode(buffer).decode("utf-8")
      # frame_data = {
         # 'image_data': encoded_string,
         # 'width': frame.shape[1],
         # 'height': frame.shape[0],
         # 'channels': frame.shape[2]

      # }
      # json_data = json.dumps(frame_data)
      # server.sendto(json_data.encode("utf-8"), (CHOSTNAME, CPORT))
      # # no ++ in python...
      # # frames += 1
      # print(frames)
      # server_sned
      # time.sleep(2)


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
   elif(data["command"] == "steercam"):
      # it is reversed lol...
      cam_motor.servo[cam_motor_pin].angle = 180 - data["value"]
   elif(data["command"] == "steercar"):
      steering_motor.servo[steering_motor_pin].angle = data["value"]
   else:
      #default
      stopcar()


def main():
   try:
      print("Starting up server...") if logs else None
      keyboard.on_press(stop_server_event_handler)
      t1 = threading.Thread(target=start)
      # when i made this code i didn't know the sys and signal package didn't exist... future devs please fix this code
      t1.daemon = True
      t1.start()
      # t2.start()
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