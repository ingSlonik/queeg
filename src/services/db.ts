import { insert, update, select, remove } from "easy-db-node";

import { StaticItemProps, WindowSettings } from "../types";

const ITEM_COLLECTION = "item";
const WINDOW_COLLECTION = "window";

// Windows
export async function getWindows(): Promise<WindowSettings[]> {
    const settings = await select(WINDOW_COLLECTION);

    if (Object.keys(settings).length === 0) {
        // first run
        await addWindow({ id: 1, icon: "icon.png", title: "Queeg" });
        return await getWindows();
    } else {
        return Object.keys(settings).map(id => ({ ...settings[id], id }));
    }
}

export async function addWindow(window: WindowSettings): Promise<number> {
    return await insert(WINDOW_COLLECTION, window);
}
export async function setWindow(window: WindowSettings): Promise<void> {
    await update(WINDOW_COLLECTION, window.id, window);
}
export async function deleteWindow(id: number): Promise<void> {
    await remove(WINDOW_COLLECTION, id);
}

// Items
export async function getItems(windowId: number): Promise<StaticItemProps[]> {
    const items = await select(ITEM_COLLECTION);
    return Object.keys(items).map(id => ({ ...items[id], id })).filter(item => {
        // back compatibility
        if (!item.windowId) {
            item.windowId = 1;
        }

        return item.windowId == windowId;
    });
}

export async function addItem(item: StaticItemProps): Promise<number> {
    return await insert(ITEM_COLLECTION, item);
}

export async function setItem(item: StaticItemProps): Promise<void> {
    await update(ITEM_COLLECTION, item.id, item);
}

export async function deleteItem(id: number): Promise<void> {
    await remove(ITEM_COLLECTION, id);
}