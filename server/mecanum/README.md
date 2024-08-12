# Mecanum Code

## Setup

First ssh into the car after turning it on (ssh winmain@local_ip)

To run this code, you can either navigate to Desktop/new_code_2024/MecanumCode or paste this folder from here into the raspberry pi and modify the IP address in variables.py. All the libraries should be there, but if necessary install them. Enter the directory and run the following commands to run the code:

```
sudo pigpiod
python main.py
```

## Bugs

The code crashes and runs into errors when you try to shut it down (press Ctrl + C). This is happening because we are using both gpiozero and RPi.GPIO, which is not recommended as leads to many issue (race conditions, etc).

There used to be a camera on the mecanum car, but that was Dhruv's personal webcam, so find one to use or use the other car's webcam.
