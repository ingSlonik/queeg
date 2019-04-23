import { shell, WebviewTag } from "electron";

import configuration from "./configuration";

import keyEvents from "./keyEvents";

function getElement(tag: string, properties: { [key: string]: any }, children?: Array<HTMLElement>): HTMLElement {
    const element = document.createElement(tag);
    Object.keys(properties).forEach(prop => element[prop] = properties[prop]);
    if (children) {
        children.forEach(child => element.appendChild(child));
    }
    return element;
}

export default function renderer(applicationIndex: number) {
    const application = configuration[applicationIndex];

    const body = document.body;
    const nav = document.getElementById("nav");

    document.title = application.title;

    const all: Array<{ name: string, button: HTMLElement, webview: WebviewTag, lastDate: Date }> = [];

    application.items.forEach((item, i) => {
        const { name, icon, url, partition, alert, color } = item;

        // button
        const background = getElement("div", { className: "background" }, []);
        const number = getElement("div", { className: "number" }, []);
        const partitionElement = getElement("div", { className: "partition", innerText: partition.replace("persist:", "").charAt(0).toLocaleUpperCase() });
        const img = getElement("img", { alt: name, src: `../img/${icon}` });
        const titleElement = getElement("div", { className: "title" });
        const label = getElement("div", { className: "label" }, [
            getElement("div", { className: "text" }, [
                getElement("div", { className: "name", innerText: name }),
                titleElement,
            ]),
            getElement("div", { className: "arrow" }),
        ]);

        const button = getElement(
            "div",
            {
                className: i === 0 ? "button active" : "button",
                onclick: () => {
                    all.forEach(a => {
                        a.button.className = "button";
                        a.webview.style.display = "none";
                        if (a.webview === webview) {
                            a.lastDate = new Date();
                        }
                    });

                    button.className = "button active";
                    webview.style.display = "flex";
                }
            },
            [
                background,
                number,
                partitionElement,
                img,
                label,
            ]
        );

        if (color) {
            button.style.borderLeftColor = color;
            background.style.backgroundColor = color;
        }

        nav.appendChild(button);
        // buttons.push(button);

        // webview
        const webview = document.createElement("webview");
        webview.src = url;
        webview.partition = partition;
        webview.style.display = i === 0 ? "flex" : "none";
        webview.addEventListener("new-window", (e) => {
            shell.openExternal(e.url)
        });
        webview.addEventListener("page-title-updated", (e) => {
            titleElement.innerText = e.title;
        });

        if (alert) {
            alert(item, webview, (alert) => {
                if (alert) {
                    number.innerText = alert;
                    number.style.display = "block";
                } else {
                    number.style.display = "none";
                }
            });
        }

        body.appendChild(webview);
        // webviews.push(webview);

        all.push({
            name,
            button,
            webview,
            lastDate: new Date(),
        })
    });

    const { keyDown, keyUp } = keyEvents(all.map(a => a.webview));
    const switchElement = document.getElementById("switch");
    let pressControl = false;
    let switchTabState: "none" | "switching" = "none";
    let switchAbout = 0;

    keyDown(key => {
        if (key === "Control") {
            pressControl = true;
        }
        if (pressControl && key === "Tab") {
            switchTabState = "switching";
            switchAbout = (switchAbout + 1) % all.length;
            switchElement.style.display = "flex";

            const sortAll = all.sort((a ,b) => b.lastDate.getTime() - a.lastDate.getTime());
            switchElement.innerText = sortAll[switchAbout].name;
        }
    });

    keyUp(key => {
        if (key === "Control") {
            pressControl = false;
            if (switchTabState === "switching") {
                
                const sortAll = all.sort((a ,b) => b.lastDate.getTime() - a.lastDate.getTime());
                sortAll[switchAbout].button.click();
                
                switchTabState = "none";
                switchAbout = 0;
                switchElement.style.display = "none";
            }
        }
    });
}
