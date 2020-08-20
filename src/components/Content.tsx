import * as React from "react";

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import useContext from "./Context";

import FormItem from "./FormItem";

import WebView from "./WebView";
import alerts from "../alerts";

import { Item } from "../types";

export default function Content() {
    const { items, activeItemIndex, setDynamicItemProps } = useContext();

    const alertNames = items.map(item => item.static.alert);

    // To have the same references of webViewFunction with changing others things
    const webViewFunctions = React.useMemo(() => {
        return items.map((item, i) => {
            const { alert } = item.static;
            if (alert && alerts[alert]) {
                return alerts[alert].fn(item, alert => setDynamicItemProps(i, dynamic => ({ ...dynamic, alert })))
            } else {
                return null;
            }
        });
    }, [JSON.stringify(alertNames)]);

    const [ editItem, editIndex ] = items.map((v, i): [Item, number] => [v, i]).filter(([v, i]) => v.dynamic.showForm)[0] || [null, null];

    return <div className={"context-wrap"}>
        {items.length === 0 && <div style={{ textAlign: "center" }}>
            <h1>Welcome to the Queeg</h1>
            <p>Add your first item on left ;-)</p>
        </div>}
        {editItem && editIndex !== null && <div className="MuiPaper-root" style={{ display: "flex", flexDirection: "column", position: "relative", zIndex: 100, height: "100%", width: "100%" }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={() => setDynamicItemProps(editIndex, dynamic => ({ ...dynamic, showForm: false }))}>
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6">
                        Edit
                    </Typography>
                </Toolbar>
            </AppBar>
            <div style={{ flexGrow: 1, padding: "32px 64px" }}>
                <FormItem id={editItem.static.id} />
            </div>
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
            onReloaded={() => setDynamicItemProps(i, dynamic => ({ ...dynamic, reload: false }))}
            getTitle={title => setDynamicItemProps(i, dynamic => ({ ...dynamic, title }))}
        />)}
    </div>;
}
