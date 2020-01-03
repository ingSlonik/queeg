import { insert, update, select, remove } from "easy-db-node";

import { StaticItemProps } from "../types";

type WindowsConfiguration = {
    position: "top" | "left",
};

export async function getWindowsConfiguration(): Promise<WindowsConfiguration> {
    const conf = await select("window", 1);

    if (conf) {
        return { position: "left" };
    } else {
        return conf;
    }
}


export async function getItems(): Promise<StaticItemProps[]> {
    const items = await select("item");
    return Object.keys(items).map(id => ({ ...items[id], id }));
}

export async function addItem(item: StaticItemProps): Promise<number> {
    return await insert("item", item);
}

export async function setItem(item: StaticItemProps): Promise<void> {
    await update("item", item.id, item);
}

export async function deleteItem(id: number): Promise<void> {
    await remove("item", id);
}