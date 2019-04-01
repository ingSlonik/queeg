import { Alert } from "./types";

const getNumberInBracket = new RegExp("\\(+(\\d*)\\)");

export const alertFromNumber: Alert = (item, webview, cb) => {
    webview.addEventListener("page-title-updated", (event) => {
        const result = event.title.match(getNumberInBracket);
        if (result && result[1]) {
            cb(result[1]);
        } else {
            cb(null);
        }
    });
}

export const togglStatus: Alert = (item, webview, cb) => {
    webview.addEventListener("page-title-updated", (event) => {
        if (event.title === "Toggl") {
            cb("⏹️");
        } else {
            cb("▶️");
        }
    });
}

export const alertChat: Alert = (item, webview, cb) => {
    webview.addEventListener("page-title-updated", (event) => {
        const { title } = event;
        if (title.includes("messaged")) {
            // first letter messaged people/room
            cb(title.charAt(0));
        } else {
            cb(null);
        }
    });
}


export const alertTestTitle: Alert = (item, webview, cb) => {
    webview.addEventListener("page-title-updated", (event) => {
        console.log("Test title:", item.name, event.title);
    });
    webview.addEventListener('console-message', (e) => {
        console.log('Guest page logged a message:', item.name, e.message)
    })

    cb(null);
}
