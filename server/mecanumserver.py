from __future__ import division
import time
from colorama import Fore, Style, Back
import traceback
# import keyboard
import threading
import Adafruit_PCA9685
from threading import Thread
import socket
import json
# Import the PCA9685 module.
import RPi.GPIO as GPIO
import variables
from gpiozero import DistanceSensor, Device
from gpiozero.pins.pigpio import PiGPIOFactory

# use the correct gpio factory... we are mixing PiGPIOFactory
Device.pin_factory = PiGPIOFactory()


##NETWORKING
bufferSize = 1024
# DO NOT HARD CODE THIS. WE ARE DOING SO FOR TESTING PURPOSES. BE WARNED
HOSTNAME = variables.IP_SERVER_ZT # for local 10.61.1.234
PORT = 6744
logs = True #Have logs
manualOverride = False
# Initialize the PCA9685 using the default address (0x40).
pwm = Adafruit_PCA9685.PCA9685()
move_speed = 4000  # Max pulse length out of 4096

GPIO.setmode(GPIO.BCM)  # GPIO number in BCM mode
GPIO.setwarnings(False)

uds = DistanceSensor(trigger=20, echo=21, max_distance=0.7)

emergency = False
disable_forward = False
class Motor:
    def __init__(self, motor_pin, direction_pin1, direction_pin2):
        self.motor_pin = motor_pin
        self.direction_pin1 = direction_pin1
        self.direction_pin2 = direction_pin2
        GPIO.setup(direction_pin1, GPIO.OUT)
        GPIO.setup(direction_pin2, GPIO.OUT)

    def set_speed(self, speed):
        pwm.set_pwm(self.motor_pin, 0, speed)

    def clockwise(self):
        GPIO.output(self.direction_pin1, GPIO.LOW)
        GPIO.output(self.direction_pin2, GPIO.HIGH)
        self.set_speed(move_speed)

    def counterclockwise(self):
        GPIO.output(self.direction_pin1, GPIO.HIGH)
        GPIO.output(self.direction_pin2, GPIO.LOW)
        self.set_speed(move_speed)

    def stop(self):
        GPIO.output(self.direction_pin1, GPIO.LOW)
        GPIO.output(self.direction_pin2, GPIO.LOW)
        self.set_speed(0)


# Create motor instances
motor_rl = Motor(0, 23, 24)
motor_rr = Motor(1, 27, 22)
motor_fr = Motor(2, 12, 13)
motor_fl = Motor(3, 6, 5)

def stop_car():
    print("stopcar")
    motor_rl.stop()
    motor_rr.stop()
    motor_fr.stop()
    motor_fl.stop()
def forward():
    if disable_forward:
        print("disabling forward")
        return
    else:
        print("forward allowed")
    motor_rl.counterclockwise()
    motor_rr.clockwise()
    motor_fr.clockwise()
    motor_fl.counterclockwise()
def backward():
    motor_rl.clockwise()
    motor_rr.counterclockwise()
    motor_fr.counterclockwise()
    motor_fl.clockwise()

def strafe_right():
    motor_rl.clockwise()
    motor_rr.clockwise()
    motor_fr.counterclockwise()
    motor_fl.counterclockwise()

def strafe_left():
    motor_rl.counterclockwise()
    motor_rr.counterclockwise()
    motor_fr.clockwise()
    motor_fl.clockwise()

def diagonal_fl():
    motor_rl.counterclockwise()
    motor_fr.clockwise()

def diagonal_rl():
    motor_rr.counterclockwise()
    motor_fl.clockwise()

def diagonal_fr():
    motor_fl.counterclockwise()
    motor_rr.clockwise()

def diagonal_rr():
    motor_rl.clockwise()
    motor_fr.counterclockwise()

def rotate_clockwise():
    motor_rl.counterclockwise()
    motor_rr.counterclockwise()
    motor_fr.counterclockwise()
    motor_fl.counterclockwise()

def rotate_counterclockwise():
    motor_rl.clockwise()
    motor_rr.clockwise()
    motor_fr.clockwise()
    motor_fl.clockwise()

def emergency_stop():
    print("Emergency stop starting now...")
    # The first step is to run a function every time a boolean changes, in this case uds distance
    inrange_prevval = True
    global disable_forward
    while True:
        inrange_currval = round(uds.distance * 39.3701, 2) < 10
        if(manualOverride):
            continue

        # Do logic for stopping...
        elif inrange_currval == inrange_prevval:
            pass
            # print(f"Didn't change: {round(uds.distance * 39.3701, 2)}")

        else:
            if(inrange_currval):

                # if it is in range, then we need to disable stop
                disable_forward = True
                stop_car()
                print("disabled forward!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
            # it must have left range, so we can lift restrictions
            else:
                disable_forward = False
                print("reeanbled forwrad!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")


        inrange_prevval = inrange_currval
        time.sleep(0.0075)

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
   print("Thread stopped, start method broken out of") if logs else None




def handle_client(data, address):
   print(f"New Data Packet... {json.loads(data)}, from {address}") if logs else None
   # this data is pickled, we need to unpickle it
   data = json.loads(data)
   # print(data["command"])
   if(data["command"] == "forward"):
       print("Moving Forward") if logs else None
       forward()
   elif(data["command"] == "backward"):
       backward()
       print("Moving backward") if logs else None
   elif(data["command"] == "strafeleft"):
       strafe_left()
       print("Strafing left") if logs else None
   elif(data["command"] == "straferight"):
       strafe_right()
       print("Strafing right") if logs else None
   elif(data["command"] == "rotate_clockwise"):
       rotate_clockwise()
       print("Rotating Clockwise") if logs else None
   elif(data["command"] == "rotate_counterclockwise"):
       rotate_counterclockwise()
       print("Rotating Countercockwise") if logs else None
   elif(data["command"] == "diagonal_fl"):
       diagonal_fl()
       print("Moving Diagonal Front Left") if logs else None
   elif(data["command"] == "diagonal_fr"):
       diagonal_fr()
       print("Moving Diagonal Front Right") if logs else None
   elif(data["command"] == "diagonal_rr"):
       diagonal_rr()
       print("Moving Diagonal Rear Right") if logs else None
   elif(data["command"] == "diagonal_rl"):
       diagonal_rl()
       print("Moving Diagonal Rear Left") if logs else None
   elif(data["command"] == "stopcar"):
      print("Stopcar")
      stop_car()

   elif(data["command"] == "togglesafetymode"):
      print("Safety mode toggled") if logs else None
      global manualOverride
      print(data["value"])
      manualOverride = data["value"]

   else:
      #default
      stop_car()




def main():
   try:
      print("Starting up server...") if logs else None
      #keyboard.on_press(stop_server_event_handler)
      t1 = threading.Thread(target=start)
      t1.daemon = True
      t2 = threading.Thread(target=emergency_stop)
      t1.start()
      t2.start()
      print("\nStarted main thread") if logs else None
      # Magic: t1.join waits for this thread to end
      #        keyboard.wait('ctrl+alt+q')
      for _ in range(4200):
          time.sleep(9000000)
   except KeyboardInterrupt:
       print("\nExiting program due to keyboard interrupt... not good") if logs else None
   except:
       traceback.print_exc()
   finally:
      # Clean up GPIO or any other resources here
      print("\nDoing Cleanup") if logs else None
      server_running = False
      stop_car() # Stops car
      print(Fore.GREEN + Back.YELLOW + "\nFinished cleanup" + Style.RESET_ALL) if logs else None