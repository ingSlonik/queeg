import * as React from "react";

import useContext from "./Context";

import WebView from "./WebView";
import alerts from "../alerts";


export default function Content() {
    const { items, activeItemIndex, setDynamicItemProps } = useContext();

    const alertNames = items.map(item => item.static.alert);

    const webViewFunctions = React.useMemo(() => {
        return alertNames.map((alert, i) => {
            if (alert && alerts[alert]) {
                const item = items[i];
                return alerts[alert].fn(item, alert => setDynamicItemProps(i, { ...item.dynamic, alert }))
            } else {
                return null;
            }
        });
    }, [ JSON.stringify(alertNames) ]);

    return <div className={"context-wrap"}>
        {items.length === 0 && <div style={{ textAlign: "center" }}>
            <h1>Welcome to the Queeg</h1>
            <p>Click to settings ;-)</p>
        </div>}
        {items.map((item, i) => <WebView
            key={i} 
            className={`context ${activeItemIndex < i ? "before" : activeItemIndex > i ? "after" : "center"}`}
            // style={{ display: activeItemIndex == i ? "flex" : "none" }}
            style={{ display: "flex" }}
            src={item.static.url}
            partition={item.static.partition}
            webViewFunction={webViewFunctions[i]}
            reload={item.dynamic.reload}
            onReloaded={() => setDynamicItemProps(i, { ...item.dynamic, reload: false })}
            getTitle={title => setDynamicItemProps(i, { ...item.dynamic, title })}
        />)}
    </div>;
}
