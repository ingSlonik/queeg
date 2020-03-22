// Modules to control application life and create native browser window
import { app, nativeImage, BrowserWindow } from "electron";
import { resolve } from "path";

import { getWindows } from "./services/db";

import { WindowSettings } from "./types";

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
const windows = {};

async function openAllWindows() {
    const configuration = await getWindows();

    configuration.forEach((windowSettings) => {
        const { id } = windowSettings;
        if (typeof windows[id] === "undefined" || windows[id] === null) {
            createWindow(windowSettings);
        }
    });
}

function createWindow(windowSettings: WindowSettings) {
    // Create the browser window.
    const window = new BrowserWindow({
        width: 1200,
        height: 728,
        // darkTheme: true,
        autoHideMenuBar: true,
        icon: nativeImage.createFromPath(resolve(__filename, "..", "..", "img", "icons", windowSettings.icon)),
        webPreferences: {
            nodeIntegration: true,
            webviewTag: true,
        }
    });

    // and load the index.html of the app.
    window.loadFile(resolve(__dirname, "..", "static", "index.html" ), { search: `id=${windowSettings.id}` });

    // Open the DevTools.
    // window.webContents.openDevTools();

    // Emitted when the window is closed.
    window.on("closed", () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        windows[windowSettings.id] = null;
    })

    windows[windowSettings.id] = window;
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", openAllWindows);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
        app.quit()
    }
});

app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    openAllWindows();
});
