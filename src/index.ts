import { Application } from "./types";

// Modules to control application life and create native browser window
import { app, BrowserWindow } from "electron";
import { resolve } from "path";

import configuration from "./configuration";

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
const windows = [];

function openAllWindows() {
    configuration.forEach((application, index) => {
        if (typeof windows[index] === "undefined" || windows[index] === null) {
            createWindow(application, index);
        }
    });
}

function createWindow(application: Application, index: number) {
    // Create the browser window.
    const window = new BrowserWindow({
        width: 1024,
        height: 728,
        darkTheme: true,
        autoHideMenuBar: true,
        icon: resolve(__dirname, "..", "img", application.icon),
        webPreferences: {
            plugins: true,
        },
    });

    // and load the index.html of the app.
    window.loadFile(resolve(__dirname, "index.html" ), { search: `index=${index}` });

    // Open the DevTools.
    window.webContents.openDevTools()

    // Emitted when the window is closed.
    window.on("closed", () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        windows[index] = null
    })

    windows[index] = window;
}


app.setName("Queeg");

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
