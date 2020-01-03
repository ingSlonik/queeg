import { shell } from "electron";

import * as React from "react";
import { useState, useEffect } from "react";

import { WebviewTag } from "electron";
import { WebviewFunction } from "../types";

type WebViewProps = {
    className: string,
    style: React.CSSProperties,
    src: string,
    partition: string,
    webViewFunction: null | WebviewFunction,
    reload: boolean,
    onReloaded: () => void,
    getTitle: (title: string) => void,
};


export default function WebViewWrap({ className, style, src, partition, webViewFunction, reload, onReloaded, getTitle }: WebViewProps) {
    const [div, setDiv] = useState<null | HTMLDivElement>(null);
    const [webview, setWebview] = useState<null | WebviewTag>(null);

    if (webview) {
        for (const key in style) {
            webview.style[key] = style[key];
        }
    }

    // remove WebView with unmount
    useEffect(() => {
        return () => {
            if (div && webview) {
                div.removeChild(webview);
            }
        }
    }, []);

    // change src and partition
    useEffect(() => {
        if (div && webview) {
            webview.src = src;
            // Partition cannot by changed on the fly :(
            // webview.partition = partition;
        }
    }, [ src, partition ]);

    // reload
    useEffect(() => {
        if (reload === true) {
            if (webview) {
                webview.reload();
            }
            //setDiv(null);
            //setWebview(null);
            onReloaded();
        }
    }, [ reload ]);

    // GetTitle
    useEffect(() => {
        if (webview) {
            function listener(e) {
                getTitle(e.title);
            }
            webview.addEventListener("page-title-updated", listener);
            return () => webview.removeEventListener("page-title-updated", listener);
        } else {
            return () => {};
        }
    }, [ getTitle ]);

    // WebviewFunction
    useEffect(() => {
        if (webview && webViewFunction) {
            const { mount, unmount } = webViewFunction(webview);
            mount();
            return () => {
                unmount();
            }
        } else {
            return () => {};
        }
    }, [ webview, webViewFunction ]);


    return <div ref={refDiv => {
        if (refDiv !== null && refDiv !== div) {
            const webview = document.createElement("webview");
            webview.src = src;
            webview.partition = partition;
            webview.addEventListener("new-window", (e) => {
                shell.openExternal(e.url)
            });

            // getWebView(webview);
            refDiv.appendChild(webview);

            setDiv(refDiv);
            setWebview(webview);
        }
    }} style={style} className={`web-view-wrap ${className}`} />;
}