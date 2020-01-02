import * as React from "react";

import { getItems, addItem, setItem } from "../services/db";

import { Item, StaticItemProps, DynamicItemProps } from "../types";

type ContextValue = {
    title: string,
    icon: string,
    nav: { position: "left" | "top" },
    activeItemIndex: number,
    items: Array<Item>,

    setActiveItemIndex: (index: number) => void,

    addItem: (wva: StaticItemProps) => void,
    saveItem: (wva: StaticItemProps) => void,
    setDynamicItemProps: (index: number, dip: DynamicItemProps) => void,
};

const defaultContext: ContextValue = {
    title: "Queeg",
    icon: "icon.ico",
    nav: { position: "left" },
    activeItemIndex: 0,
    items: [],
    setActiveItemIndex: () => {},
    addItem: () => {},
    saveItem: () => {},
    setDynamicItemProps: () => {},
}

const Context = React.createContext(defaultContext);

export function Provider({ children, index }) {

    const [ items, setItems ] = React.useState<Item[]>(defaultContext.items);
    const [ activeItemIndex, setActiveItemIndex ] = React.useState(defaultContext.activeItemIndex);

    React.useEffect(() => {
        getItemsForContext().then(items => setItems(items));
    }, []);

    return <Context.Provider value={{
        ...defaultContext,
        items,
        activeItemIndex,
        setActiveItemIndex: activeItemIndex => {
            setActiveItemIndex(activeItemIndex);
            setItems(items => items.map((item, i) => {
                if (activeItemIndex === i) {
                    return { ...item, dynamic: { ...item.dynamic, lastDate: new Date() } };
                } else {
                    return item;
                }
            }));
        },
        addItem: async item => {
            await setItem(item);
            setItems(await getItemsForContext());
        },
        saveItem: async item => {
            await setItem(item);
            setItems(await getItemsForContext());
        },
        setDynamicItemProps: (index, dynamic) => {
            setItems(items => items.map((item, i) => {
                if (index === i) {
                    return { ...item, dynamic };
                } else {
                    return item;
                }
            }));
        },
    }}>
        {children}
    </Context.Provider>
}

async function getItemsForContext(): Promise<Item[]> {
    const staticProps = await getItems();
    
    return staticProps.map(staticProp => {
        return {
            static: staticProp,
            dynamic: {
                title: staticProp.name,
                alert: null,
                reload: false,
                lastDate: new Date(),
            }
        };
    });
}

export default function useContext(): ContextValue {
    return React.useContext(Context);
}
