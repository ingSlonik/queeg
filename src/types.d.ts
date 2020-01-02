import { WebviewTag } from 'electron';

// file name of image in folder `img`
type Icon = string;

// can separate context of WebViews, define by https://electronjs.org/docs/api/webview-tag#partition
type Partition = string;

export type WebviewFunction = (webview: WebviewTag) => {
    mount: () => void,
    unmount: () => void,
};

export type Alert = {
    name: string,
    fn: (item: Item, cb: (alert: null | string) => void) => WebviewFunction,
};

export type Item = {
    static: StaticItemProps,
    dynamic: DynamicItemProps,
};

export type StaticItemProps = {
    id: number,
    order: number,
    name: string,
    icon: Icon,
    url: string,
    partition: Partition,
    color: "primary" | "secondary",
    shortText: string,
    alert: null | string,
};

export type DynamicItemProps = {
    title: string,
    alert: string,
    reload: boolean,
};

export type Application = {
    title: string,
    icon: Icon,
    activeItemIndex: number,
    items: Array<Item>,
};
