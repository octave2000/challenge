const { app, BrowserWindow } = require("electron");
const path = require("path");

// 1. Detect if we are in Dev mode or Production
const isDev = process.env.NODE_ENV === "development";

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // 2. The Critical Logic Switch
  if (isDev) {
    // In Dev: Load the Vite Server URL
    win.loadURL("http://localhost:5173");
  } else {
    // In Production: Load the local file from the dist folder
    // This looks for: /release/linux-unpacked/resources/app/dist/index.html
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  }
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
