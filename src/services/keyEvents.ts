import { WebviewTag } from "electron";
import { useState, useEffect } from "react";

type KeyEvents = { onKeyDown: (key: string) => void, onKeyUp: (key: string) => void };

export function useKeyEvents(onChange: () => void, onConfirm: () => void) {
    const [ keyEvents, setKeyEvents ] = useState<KeyEvents>({});

    const [ pressControl, setPressControl ] = useState(false);
    const [ switchTabState, setSwitchTabState ] = useState(false);
    
    keyEvents.onKeyDown = (key) => {
        if (key === "Control") {
            setPressControl(true);
        }
        if (pressControl && key === "Tab") {
            setSwitchTabState(true);
            onChange();
        }
    };

    keyEvents.onKeyUp = (key) => {
        if (key === "Control") {
            setPressControl(false);
            if (switchTabState === true) {
                setSwitchTabState(false);
                onConfirm();
            }
        }
    }

    useEffect(() => {
        setTimeout(() => {
            const keyEvents = initKeyEvents();
            setKeyEvents(keyEvents);
        }, 1000);
    }, []);
}

export function initKeyEvents(): KeyEvents {
    // TODO: check when is updated
    // window.webContents.on("did-attach-webview", (...a) => console.log(a));

    const ret: KeyEvents = {
        onKeyDown: (key: string) => {},
        onKeyUp: (key: string) => {},
    }

    const keys: { [key: string]: boolean } = {};

    function handleKeyDown(key: string) {
        if (keys[key] !== false) {
            keys[key] = false;
            ret.onKeyDown(key);
        }
    }
    function handleKeyUp(key: string) {
        if (keys[key] !== true) {
            keys[key] = true;
            ret.onKeyUp(key);
        }
    }

    document.addEventListener("keydown", (e) => handleKeyDown(e.key));
    document.addEventListener("keyup", (e) => handleKeyUp(e.key));

    const webviews = document.querySelectorAll("webview");

    for (const w of webviews) {
        const webview = w as WebviewTag;
        webview.addEventListener("console-message", (e) => {
            if (e.message.startsWith("QueegEventKeyDown:")) {
                handleKeyDown(e.message.slice(18));
            }
            if (e.message.startsWith("QueegEventKeyUp:")) {
                handleKeyUp(e.message.slice(16));
            }
        });

        webview.addEventListener("did-frame-finish-load", () => {
            webview.executeJavaScript(String(webviewJavaScript) + "\n webviewJavaScript();");
        });
    }

    return ret;
}

function webviewJavaScript() {
    document.addEventListener("keydown", (e) => console.log(`QueegEventKeyDown:${e.key}`));
    document.addEventListener("keyup", (e) => console.log(`QueegEventKeyUp:${e.key}`));
}