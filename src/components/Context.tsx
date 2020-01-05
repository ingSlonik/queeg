import * as React from "react";

import { getItems, addItem, setItem, deleteItem } from "../services/db";

import { Item, StaticItemProps, DynamicItemProps } from "../types";

type ContextValue = {
    title: string,
    icon: string,
    nav: { position: "left" | "top" },
    activeItemIndex: number,
    items: Array<Item>,

    setActiveItemIndex: (index: number) => void,

    addItem: (wva: StaticItemProps) => Promise<number>,
    saveItem: (wva: StaticItemProps) => void,
    deleteItem: (id: number) => Promise<void>;
    setDynamicItemProps: (index: number, set: (dip: DynamicItemProps) => DynamicItemProps) => void,
    changeOrder: (index: number, direction: "up" | "down") => void,
};

const defaultContext: ContextValue = {
    title: "Queeg",
    icon: "icon.ico",
    nav: { position: "left" },
    activeItemIndex: 0,
    items: [],
    setActiveItemIndex: () => {},
    addItem: async () => 0,
    saveItem: () => {},
    deleteItem: async () => {},
    setDynamicItemProps: () => {},
    changeOrder: () => {},
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
            const id = await addItem(item);
            const items = await getItemsForContext();
            setItems(items);
            setActiveItemIndex(items.length - 1);
            return id;
        },
        saveItem: async item => {
            await setItem(item);
            setItems(await getItemsForContext());
        },
        deleteItem: async id => {
            await deleteItem(id);
            setItems(await getItemsForContext());
            setActiveItemIndex(0);
        },
        setDynamicItemProps: (index, set) => {
            setItems(items => items.map((item, i) => {
                if (index === i) {
                    return { ...item, dynamic: set(item.dynamic) };
                } else {
                    return item;
                }
            }));
        },
        changeOrder: async (index, direction) => {
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                let order = i * 2;
                if (i === index) {
                    if (direction === "up") {
                        order -= 3;
                    } else {
                        order += 3;
                    }
                }
                await setItem({ ...item.static, order });
            }
            setItems(await getItemsForContext());
        },
    }}>
        {children}
    </Context.Provider>
}

async function getItemsForContext(): Promise<Item[]> {
    const staticProps = await getItems();
    
    return staticProps.sort((a, b) => a.order - b.order).map(staticProp => {
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
