import { Alert } from "./types";

const getNumberInBracket = new RegExp("\\(+(\\d*)\\)");

type Alerts = { [key: string]: Alert };

const alerts: Alerts = {
    alertFromNumber: {
        name: "Alert from number in title of page",
        fn: (item, cb) => (webview) => {
            const listener = (event) => {
                const result = event.title.match(getNumberInBracket);
                console.log({event, result})
                if (result && result[1]) {
                    cb(result[1]);
                } else {
                    cb(null);
                }
            }

            return {
                mount: () => webview.addEventListener("page-title-updated", listener),
                unmount: () => webview.removeEventListener("page-title-updated", listener),
            };
        },
    },
    togglStatus: {
        name: "Status for Toggl",
        fn: (item, cb) => (webview) => {
            const listener = (event) => {
                if (event.title !== "Toggl") {
                    cb("▶️");
                } else {
                    cb("⏹️");
                }
            }

            return {
                mount: () => webview.addEventListener("page-title-updated", listener),
                unmount: () => webview.removeEventListener("page-title-updated", listener),
            };
        },
    },
    alertChat: {
        name: "Status for google chat",
        fn: (item, cb) => (webview) => {
            const listener = (event) => {
                const { title } = event;
                if (title.includes("messaged")) {
                    // first letter messaged people/room
                    cb(title.charAt(0));
                } else {
                    cb(null);
                }
            }

            return {
                mount: () => webview.addEventListener("page-title-updated", listener),
                unmount: () => webview.removeEventListener("page-title-updated", listener),
            };
        },
    },
    alertTestTitle: {
        name: "Development alert",
        fn: (item, cb) => (webview) => {
            const listener1 = (event) => {
                console.log("Test title:", item.static.name, event.title);
            }
            const listener2 = (event) => {
                console.log('Guest page logged a message:', item.static.name, event.message)
            }

            cb("Dev");

            return {
                mount: () => {
                    console.log("Mount development alert");
                    webview.addEventListener("page-title-updated", listener1);
                    webview.addEventListener("console-message", listener2);
                },
                unmount: () => {
                    console.log("Unmount development alert");
                    webview.removeEventListener("page-title-updated", listener1);
                    webview.removeEventListener("console-message", listener2);
                },
            };
        }
    },
};
export default alerts;