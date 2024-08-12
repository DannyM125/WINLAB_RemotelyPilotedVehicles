# First Person View Car Repository

This README will teach you how to setup the remotely piloted vehicles project.

This repository has the code for both the server (the robot code) and the client code (runs on computer)

The client uses Javascript, React, Electron, Ant Design. For more information, check out the README in the "desktopclient folder"

The server uses python. For more information, check out the README in the server folder.

Read this manual before setting client and server. After reading, set up server then setup the client.

##

**Download client code on computer**

## Getting started

First, download this code and open it up in your IDE of choice (We use vscode). Open up a terminal to run commands.

Pull the repo down onto you local machine (click the code button and you will see many options, like opening with vscode).

## Description

This project allows you to control a robot with multiple sensors with low latency from anywhere over the internet.

## Possible improvements

One direction to go in is to add more sensing and create a UI to interact with it. We started implementing audio and depth sensing features. Object detection or improved networking (improving the camera stream) would also be another way to go.

## Bash Scripts

In the root folder, you will see two bash scripts. These are scripts we made to conveniently transfer files from a unix based system to our raspberry pi. trans.sh transfers the file, and t_and_r.sh transfers and then runs the file. You need to change the permissions of script to be able to execute it. If you have a windows, you are mostly out of luck (you could try gitbash for a bash environment, but idk)

## Authors of repo

Dhruv Ramaswamy

Nandini Venkatesh

Daniel Mahany

Advisor: Dr. Richard P Martin

If you have any questions, reach out to
dhruv.ramaswamy@gmail.com
