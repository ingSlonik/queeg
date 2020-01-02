import * as React from "react";

import useContext, { Provider } from "./Context";

import Nav from "./Nav";
import Content from "./Content";
import Switch from "./Switch";

type AppProps = {
    index: number,
};

export default function App({ index }: AppProps) {

    const { nav, title } = useContext();

    React.useEffect(() => {
        document.title = title;
    }, [ title ]);

    return <Provider index={index}>
        <div id="wrap" className={nav.position}>
            <Switch />
            <Nav isSetting={false} />
            <Content />
        </div>
    </Provider>;
}