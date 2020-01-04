import { readdir } from "fs";
import { resolve } from "path";

import * as React from "react";

import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Button from '@material-ui/core/Button';

import IconButton from '@material-ui/core/IconButton';
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';
import CloseIcon from '@material-ui/icons/Close';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

import useContext from "./Context";

import alerts from "../alerts";

export default function ItemForm({ id }: { id: number }) {

    const { items, saveItem, deleteItem } = useContext();
    const item = items.filter(item => item.static.id === id)[0] || null;
    const [icons, setIcons] = React.useState<string[] | null>(null);

    const [editItem, setEditItem] = React.useState(item.static);
    const [showSnackbar, setShowSnackbar] = React.useState(false);

    React.useEffect(() => {
        readdir(resolve("img", "icons"), { encoding: "utf8" }, (err, files) => {
            if (files) {
                setIcons(files.filter(name => name.endsWith(".png")));
            }
        });
    }, []);

    if (editItem === null) {
        return <h2>Whooooo :(</h2>;
    } else {
        return <form>
            <TextField
                required
                fullWidth
                id="name"
                label="Name"
                margin="normal"
                value={editItem.name}
                onChange={e => setEditItem({ ...editItem, name: e.target.value })}
            />
            {icons !== null && <TextField
                select
                fullWidth
                id="icon"
                label="Icon"
                margin="normal"
                value={editItem.icon}
                onChange={e => setEditItem({ ...editItem, icon: e.target.value })}
            >
                {icons.map(icon => (
                    <MenuItem key={icon} value={icon}>
                        <img style={{ height: "20px", marginRight: "16px" }} src={`../img/icons/${icon}`} /> {" "}
                        {icon}
                    </MenuItem>
                ))}
            </TextField>}
            <TextField
                required
                fullWidth
                id="url"
                label="URL"
                margin="normal"
                value={editItem.url}
                onChange={e => setEditItem({ ...editItem, url: e.target.value })}
            />
            <TextField
                select
                required
                fullWidth
                id="alert"
                label="Alert"
                margin="normal"
                value={editItem.alert || ""}
                onChange={e => setEditItem({ ...editItem, alert: e.target.value })}
            >
                <MenuItem value="">No alert</MenuItem>
                {Object.keys(alerts).map(key => <MenuItem key={key} value={key}>{alerts[key].name}</MenuItem>)}
            </TextField>
            <TextField
                fullWidth
                id="partition"
                label="Partition"
                margin="normal"
                value={editItem.partition}
                onChange={e => setEditItem({ ...editItem, partition: e.target.value })}
                helperText={<a target={"_blank"} href={"https://electronjs.org/docs/api/webview-tag#partition"}>https://electronjs.org/docs/api/webview-tag#partition</a>}
            />
            
            {/*<TextField
                fullWidth
                id="shortText"
                label="Short text"
                margin="normal"
                value={editItem.shortText}
                onChange={e => setEditItem({ ...editItem, shortText: e.target.value })}
            />*/}
            <TextField
                select
                fullWidth
                id="color"
                label="Color"
                margin="normal"
                value={editItem.color}
                onChange={e => setEditItem({ ...editItem, color: e.target.value === "primary" ? "primary" : "secondary" })}
            >
                <MenuItem value="primary">primary</MenuItem>
                <MenuItem value="secondary">secondary</MenuItem>
            </TextField>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    onClick={() => {
                        saveItem(editItem);
                        setShowSnackbar(true);
                    }}>
                    Save
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<DeleteIcon />}
                    onClick={() => {
                        deleteItem(editItem.id);
                        setShowSnackbar(true);
                    }}>
                    Delete
                </Button>
            </div>

            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                open={showSnackbar}
                autoHideDuration={5000}
                onClose={() => setShowSnackbar(false)}
            >
                <MySnackbarContentWrapper
                    onClose={() => setShowSnackbar(false)}
                    message="Saved."
                />
            </Snackbar>
        </form>;
    }
}

export interface Props {
    className?: string;
    message?: string;
    onClose?: () => void;
}

function MySnackbarContentWrapper(props: Props) {
    const { className, message, onClose, ...other } = props;

    return (
        <SnackbarContent
            aria-describedby="client-snackbar"
            message={
                <span id="client-snackbar" >
                    <CheckCircleIcon />
                    {message}
                </span>
            }
            action={[
                <IconButton key="close" aria-label="close" color="inherit" onClick={onClose}>
                    <CloseIcon />
                </IconButton>,
            ]}
            {...other}
        />
    );
}