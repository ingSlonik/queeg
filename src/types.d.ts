import { WebviewTag } from 'electron';

// file name of image in folder `img`
type Icon = string;

// can separate context of WebViews, define by https://electronjs.org/docs/api/webview-tag#partition
type Partition = string;

export type Alert = (webview: WebviewTag, cb: (alert: null | string) => void) => void;

type WebView = {
    name: string,
    icon: Icon,
    url: string,
    partition: Partition,
    alert?: Alert,
    color?: string,
};

export type Application = {
    title: string,
    icon: Icon,
    items: Array<WebView>,
};

