const { app, BrowserWindow } = require("electron");
const path = require("node:path");

// Handle creating/removing shortcuts on Windows when installing/uninstalling. Idk how this works
if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    webPreferences: {
      //This is where the preload script runs

      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,

      //Don't change this, it allows us to use require (and node integration)
      //This is on so that we can't share stuff
      contextIsolation: false,
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      //__dirname is the root folder...
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });
  //Creating

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// called when Electron has finished initialization and is ready to create browser windows (for example browser window can be used here)
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  //Creates browser window
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
// WebSocket server
