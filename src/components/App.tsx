import { resolve } from "path";

import * as React from "react";

import useContext, { Provider } from "./Context";

import Nav from "./Nav";
import Content from "./Content";
import Switch from "./Switch";

const iconPath = resolve(__filename, "..", "..", "..", "img", "icons");

type AppProps = {
    windowId: number,
};

export default function App({ windowId }: AppProps) {

    const { nav } = useContext();

    return <Provider windowId={windowId}>
        <div id="wrap" className={nav.position}>
            <Switch />
            <Nav />
            <Content />
        </div>
    </Provider>;
}