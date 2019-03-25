import { Alert } from "./types";

const getNumberInBracket = new RegExp("\\(+(\\d*)\\)");

export const alertFromNumber: Alert = (webview, cb) => {
    webview.addEventListener("page-title-updated", (event) => {
        const result = event.title.match(getNumberInBracket);
        if (result && result[1]) {
            cb(result[1]);
        } else {
            cb(null);
        }
    });
}
