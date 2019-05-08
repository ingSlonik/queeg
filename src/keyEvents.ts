import { WebviewTag } from "electron";

type KeyEvents = {
    keyDown: (fn: (key: string) => void) => void,
    keyUp: (fn: (key: string) => void) => void,
};

export default function getKeyEvents(webviews: Array<WebviewTag>): KeyEvents {
    const keyDowns = [];
    const keyUps = [];

    function handleKeyDown(key: string) {
        keyDowns.forEach(kd => kd(key));
    }
    function handleKeyUp(key: string) {
        keyUps.forEach(ku => ku(key));
    }
    
    document.addEventListener("keydown", (e) => handleKeyDown(e.key));
    document.addEventListener("keyup", (e) => handleKeyUp(e.key));

    webviews.forEach(webview => {
        webview.addEventListener("console-message", (e) => {
            if (e.message.startsWith("QueegEventKeyDown:")) {
                handleKeyDown(e.message.slice(18));
            }
            if (e.message.startsWith("QueegEventKeyUp:")) {
                handleKeyUp(e.message.slice(16));
            }
        });

        webview.addEventListener("did-frame-finish-load", () => {
            webview.executeJavaScript(
                "document.addEventListener(\"keydown\", (e) => console.log(`QueegEventKeyDown:${e.key}`));" +
                "document.addEventListener(\"keyup\", (e) => console.log(`QueegEventKeyUp:${e.key}`));"
            );
        });
    });

    return {
        keyDown(fn) {
            keyDowns.push(fn);
        },
        keyUp(fn) {
            keyUps.push(fn);
        }
    };
}