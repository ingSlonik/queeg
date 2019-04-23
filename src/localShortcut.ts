import { app, BrowserWindow, globalShortcut, Accelerator } from "electron";

let appReady = false;

let shortcuts: Array<{ 
    focus: boolean,
    accelerator: Accelerator, 
    browserWindow: BrowserWindow, 
    callback: () => void 
}> = [];

app.on("ready", () => {
    appReady = true;
});

app.on("will-quit", () => {
    unregisterAll();
});

function handleShortcut(accelerator: Accelerator) {
    shortcuts
        .filter(shortcut => shortcut.accelerator === accelerator && shortcut.focus === true)
        .forEach(shortcut => shortcut.callback());
}

function registerAccelerator(accelerator: Accelerator, callback: () => void) {
    if (appReady) {
        globalShortcut.register(accelerator, callback);
    }
}

function unregisterAccelerator(accelerator: Accelerator) {
    if (appReady) {
        globalShortcut.unregister(accelerator);
    }
}

function applyGlobalShortcuts() {
    shortcuts
        .map(({ accelerator }) => accelerator)
        .reduce((accelerators, accelerator ) => accelerators.includes(accelerator) ? accelerators : [ ...accelerators, accelerator ], [])
        .forEach(accelerator => {
            const focus = shortcuts
                .reduce((focus, shortcut) => shortcut.accelerator === accelerator ? (focus || shortcut.focus) : focus, false);

            if (globalShortcut.isRegistered(accelerator)) {
                if (!focus) {
                    unregisterAccelerator(accelerator);
                }
            } else {
                if (focus) {
                    registerAccelerator(accelerator, () => handleShortcut(accelerator));
                }
            }
        });
}

function focusBrowserWindow(focus: boolean, browserWindow: BrowserWindow) {
    shortcuts = shortcuts.map(shortcut => ({
        ...shortcut,
        focus: shortcut.browserWindow === browserWindow ? focus : shortcut.focus,
    }));

    applyGlobalShortcuts();
}

function register(browserWindow: BrowserWindow, accelerator: Accelerator, callback: () => void) {

    shortcuts.push({
        focus: false,
        accelerator,
        browserWindow,
        callback,
    });

    browserWindow.on("focus", () => focusBrowserWindow(true, browserWindow));
    browserWindow.on("blur", () => focusBrowserWindow(false, browserWindow));

    applyGlobalShortcuts();
}

function unregister(browserWindow: BrowserWindow, accelerator: Accelerator) {
    shortcuts = shortcuts
        .filter(shortcut => !(shortcut.browserWindow === browserWindow && shortcut.accelerator === accelerator));

    applyGlobalShortcuts();
}

function unregisterAll() {
    shortcuts = [];
    globalShortcut.unregisterAll();
}

export default {
    register,
    unregister,
    unregisterAll,
};
