import * as React from "react";

import { addWindow, setWindow, deleteWindow, getItems, addItem, setItem, deleteItem, getWindows } from "../services/db";

import { Item, StaticItemProps, DynamicItemProps } from "../types";

type WindowProps = {
    title: string,
    icon: string,
    nav: { position: "left" | "top", size: number },
};

type ContextValue = WindowProps & {
    windowId: number,

    setWindowProps: (wp: WindowProps) => void,
    addWindow: () => void,
    removeWindow: () => void,

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
    windowId: 1,
    title: "Queeg",
    icon: "icon.png",
    nav: { position: "left", size: 150 },
    activeItemIndex: 0,
    items: [],
    setWindowProps: () => {},
    addWindow: () => {},
    removeWindow: () => {},
    setActiveItemIndex: () => {},
    addItem: async () => 0,
    saveItem: () => {},
    deleteItem: async () => {},
    setDynamicItemProps: () => {},
    changeOrder: () => {},
}

const Context = React.createContext(defaultContext);

export function Provider({ children, windowId }: { children: React.ReactChild ,windowId: number }) {

    const [ title, setTitle ] = React.useState(defaultContext.title);
    const [ icon, setIcon ] = React.useState(defaultContext.icon);
    const [ items, setItems ] = React.useState<Item[]>(defaultContext.items);
    const [ activeItemIndex, setActiveItemIndex ] = React.useState(defaultContext.activeItemIndex);

    React.useEffect(() => {
        getItemsForContext(windowId).then(items => setItems(items));
        getWindows().then(ws => ws.filter(({ id }) => id === windowId).forEach(({ title, icon }) => {
            setTitle(title);
            setIcon(icon);
        }));
    }, []);

    React.useEffect(() => {
        document.title = title;
    }, [ title ]);

    return <Context.Provider value={{
        windowId,
        title,
        icon,
        nav: defaultContext.nav,

        addWindow: () => {
            addWindow({
                id: 0,
                icon: "icon.png",
                title: "Queeg | New window"
            });
        },
        removeWindow: () => {
            deleteWindow(windowId);
        },
        setWindowProps: ({ title, icon }: WindowProps) => {
            setTitle(title);
            setWindow({ id: windowId, title, icon });
        },

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
            const id = await addItem({ ...item, windowId });
            const items = await getItemsForContext(windowId);
            setItems(items.map(item => {
                if (item.static.id === id) {
                    return { ...item, dynamic: { ...item.dynamic, showForm: true } };
                }
                return item;
            }));
            setActiveItemIndex(items.length - 1);
            return id;
        },
        saveItem: async item => {
            await setItem(item);
            setItems(await getItemsForContext(windowId));
        },
        deleteItem: async id => {
            await deleteItem(id);
            setItems(await getItemsForContext(windowId));
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
            setItems(await getItemsForContext(windowId));
        },
    }}>
        {children}
    </Context.Provider>
}

async function getItemsForContext(windowId: number): Promise<Item[]> {
    const staticProps = await getItems(windowId);
    
    return staticProps.sort((a, b) => a.order - b.order).map(staticProp => {
        return {
            static: staticProp,
            dynamic: {
                showForm: false,
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
