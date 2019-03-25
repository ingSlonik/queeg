import { shell } from "electron";

import configuration from "./configuration";

export default function renderer(applicationIndex: number) {
    const application = configuration[applicationIndex];
    
    const body = document.body;
    const nav = document.getElementById("nav");

    document.title = application.title;
    
    const buttons = [];
    const webviews = [];

    application.items.forEach(({ name, icon, url, partition, alert, color }, i) => {

        // button
        const button = document.createElement("div");
        button.className = i === 0 ? "button active" : "button";
        button.onclick = () => {
            buttons.forEach(b => b.className = "button");
            button.className = "button active";
            webviews.forEach(w => w.style.display = "none");
            webview.style.display = "flex";
        };

        nav.appendChild(button);
        buttons.push(button);
        const number = document.createElement("div");
        number.className = "number";
        button.appendChild(number);
        const partitionElement = document.createElement("div");
        partitionElement.className = "partition";
        partitionElement.innerText = partition.replace("persist:", "").charAt(0).toLocaleUpperCase();
        button.appendChild(partitionElement);
        const background = document.createElement("div");
        background.className = "background";
        button.appendChild(background);
        const img = document.createElement("img");
        img.alt = name;
        img.src = `../img/${icon}`;
        button.appendChild(img);

        if (color) {
            button.style.borderLeftColor = color;
            background.style.backgroundColor = color;
        }

        // webview
        const webview = document.createElement("webview");
        webview.src = url;
        webview.partition = partition;
        webview.style.display = i === 0 ? "flex" : "none";
        webview.addEventListener("new-window", (e) => {
            shell.openExternal(e.url)
        });
        if (alert) {
            alert(webview, (alert) => {
                if (alert) {
                    number.innerText = alert;
                    number.style.display = "block";
                } else {
                    number.style.display = "none";
                }
            });
        }

        body.appendChild(webview);
        webviews.push(webview);
    });
}
