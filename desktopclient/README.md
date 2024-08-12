# Desktop Client Information

_Written by Dhruv Ramaswamy. If you have any questions, email at dhruv.ramaswamy@gmail.com_

**This README will teach you how to start up our current client and get it working. No guarantees that this works.**

---

The client uses Javascript, React, Electron, Ant Design. This uses Vite for the build tool (written with a vscode ide)

To run this code, make sure you have node js installed (try for the latest version.). We are using npm for are js package manager (built into node js). Make sure you can run "npm" and "node" in your terminal. Make sure you terminal is in the desktop folder, and run the following commands to get the server up and running:

```
npm i
npm run start
```

Once it starts running, you can click around to see the current version of it. Vite supports hot reloading, so if you make any changes it will immediately update in the client.

## Networking/VPN

We used zerotier for our vpn. If you haven't set that up, use the local IP find the local ip addresses of each of the robots themselves (go to terminal and find the command online), and go to constants.js in the root folder and modify the IP Addresses. This will work over the same network (we used winmain), but it wont work anywhere else.

We had zerotier setup, but you will need an account. To bridge the client and the server, look at
[this tutorial by zerotier.](https://zerotier.atlassian.net/wiki/spaces/SD/pages/193134593/Bridge+your+ZeroTier+and+local+network+with+a+RaspberryPi)

[This is also a great resource to start with zerotier.](https://www.youtube.com/watch?v=sA55fcuJSQQ)

## Version control

We have two repositories in this project. There is a global repo and there is a desktopclient repo. You can commit and push to both. The desktopclient repo will only modify the desktopclient, and the global repo (in the root folder ) will modify the entire repo. We use git for our version control. I recommend for simplicity to push to the main repo.

## Contributing

In order to improve the user interface when driving, it is important to learn React. We use ant design for our UI components.

[Getting started with Ant Design](https://ant.design/docs/react/introduce)

[Getting started with electron js](https://www.electronjs.org/docs/latest/tutorial/quick-start)

Also python scripting is very useful, as well as learning gpio.
