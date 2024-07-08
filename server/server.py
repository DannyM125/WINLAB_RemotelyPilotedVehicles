#  ___   ___  ___  _   _  ___   ___   ____ ___  ____
# / _ \ /___)/ _ \| | | |/ _ \ / _ \ / ___) _ \|    \
#| |_| |___ | |_| | |_| | |_| | |_| ( (__| |_| | | | |
# \___/(___/ \___/ \__  |\___/ \___(_)____)___/|_|_|_|
#                  (____/
# Osoyoo Model-Pi L298N DC motor driver programming guide
# tutorial url: https://osoyoo.com/2020/03/01/python-programming-tutorial-model-pi-l298n-motor-driver-for-raspberry-pi/

from __future__ import division
import time
# Import the PCA9685 module.
import Adafruit_PCA9685
from gpiozero import Motor, Servo
import threading
from threading import Thread
import socket
import RPi.GPIO as GPIO
import numpy as np
import pickle
# Initialise the PCA9685 using the default address (0x40).
pwm = Adafruit_PCA9685.PCA9685()

servo_pin = 15 # servo connect to PWM 15

RIGHT = 465 # Steer servo car turn right
CENTER= 425 # Steer servo car go forward
LEFT = 385 # Steer servo car turn left

# Alternatively specify a different address and/or bus:
#pwm = Adafruit_PCA9685.PCA9685(address=0x41, busnum=2)

move_speed = 4000  # Max pulse length out of 4096
# Set frequency to 60hz, good for servos.
pwm.set_pwm_freq(60)
# pwm.set_pwm(servo_pin, 0, LEFT)
# time.sleep(1)
# pwm.set_pwm(servo_pin, 0, RIGHT)
# time.sleep(1)
# pwm.set_pwm(servo_pin, 0, CENTER)
GPIO.setmode(GPIO.BCM) # GPIO number  in BCM mode
GPIO.setwarnings(False)
# Define L298N motor pins
IN1 = 23  # right motor direction pin
IN2 = 24  # right motor direction pin
IN3 = 27  # left motor direction pin
IN4 = 22  # left motor direction pin

# Create Motor instances
right_motor = Motor(forward=IN1, backward=IN2)
left_motor = Motor(forward=IN3, backward=IN4)

def changespeed(speed):
    pwm.set_pwm(0, 0, speed)  # ENA
    pwm.set_pwm(1, 0, speed)  # ENB
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
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

# steer(CENTER)
# forward()
# time.sleep(2)
# stopcar()
# time.sleep(0.25)

# backward()
# time.sleep(2)
# stopcar()
# time.sleep(0.25)

# steer(LEFT)
# forward()
# time.sleep(2)

# steer(RIGHT)
# forward()
# time.sleep(2)

# backward()
# time.sleep(2)

# steer(LEFT)
# backward()
# time.sleep(2)
# stopcar()
# steer(CENTER)

# time.sleep(2)
# pwm.set_pwm(servo_pin, 0, 0)


# we need a buffer to hold the data in bytes

bufferSize = 1024

logs = True

# DO NOT HARD CODE THIS. WE ARE DOING SO FOR TESTING PURPOSES. BE WARNED
HOSTNAME = "10.61.1.178"
PORT = 9696
# ERROR!! TODO: Change this to DGRAM because it isn't working
server = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
server.bind((HOSTNAME, PORT))
print("Server up and listening..")

def start():
    print(f"Server is listening")
    while True:
        data, address = server.recvfrom(bufferSize)
        #cmd = cmd.decode("utf-8")
        if logs:
            print(f"Command Recieved from:  {address[0]}")
        # handles client
        thread = threading.Thread(target=handle_client, args=(data, address))
        #single thread for now...
        thread.start()

def handle_client(data, address):
    print(f"New Data Packet... {pickle.loads(data)}, from {address}")
    data = pickle.loads(data)
    # if 10 is
    if(data[10] == 1):
        print("forward!")
        forward()
    else:
        stopcar()

print("Starting...")
t1 = Thread(target=start)
t1.start()