import * as React from "react";

import useContext from "./Context";

import { useKeyEvents } from "../services/keyEvents";

export default function Switch() {

    const { items, setActiveItemIndex } = useContext();

    const [switchAbout, setSwitchAbout] = React.useState(0);

    const sortedItems = [ ...items ].sort((a ,b) => b.dynamic.lastDate.getTime() - a.dynamic.lastDate.getTime());

    function onChange() {
        const newSwitchAbout = switchAbout + 1;
        setSwitchAbout(newSwitchAbout >= items.length ? 0 : newSwitchAbout);
    };

    function onConfirm() {
        const newActiveId = sortedItems[switchAbout].static.id;
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.static.id === newActiveId) {
                setActiveItemIndex(i);
                break;
            }
        }
        setSwitchAbout(0);
    };

    useKeyEvents(onChange, onConfirm);

    return switchAbout > 0 && <div id="switch">
        {sortedItems[switchAbout].static.name}
    </div>;
}
