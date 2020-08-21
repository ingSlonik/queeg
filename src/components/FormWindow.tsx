import { readdir } from "fs";
import { platform } from "os";
import { resolve } from "path";
import { ipcRenderer } from "electron";

import * as React from "react";

import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Button from '@material-ui/core/Button';

import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import IconButton from '@material-ui/core/IconButton';
import SaveIcon from '@material-ui/icons/Save';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import CloseIcon from '@material-ui/icons/Close';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

import Alert from '@material-ui/lab/Alert';

import useContext from "./Context";

const iconPath = resolve(__filename, "..", "..", "..", "img", "icons");

export default function WindowForm() {

    const { title, icon, nav, spellCheckers, setWindowProps, addWindow, removeWindow } = useContext();

    const [icons, setIcons] = React.useState<string[] | null>(null);
    const [editProps, setEditProps] = React.useState({ title, icon, nav, spellCheckers });
    const [showSnackbar, setShowSnackbar] = React.useState<null | string>(null);

    React.useEffect(() => {
        readdir(iconPath, { encoding: "utf8" }, (err, files) => {
            if (files) {
                setIcons(files.filter(name => name.endsWith(".png")));
            }
        });
    }, []);

    const languages: string[] = React.useMemo(() => {
        const languages = ipcRenderer.sendSync('get-languages', 'all');
        return JSON.parse(languages);
    }, []);

    return <form>
        <h1>Window settings</h1>

        <Alert severity="warning">You need to restart the application to take effect.</Alert>

        <TextField
            required
            fullWidth
            id="title"
            label="Window title"
            margin="normal"
            value={editProps.title}
            onChange={e => setEditProps({ ...editProps, title: e.target.value })}
        />
        {icons === null && <div>Loading icons...</div>}
        {icons !== null && <TextField
            select
            fullWidth
            id="icon"
            label="Icon"
            margin="normal"
            value={editProps.icon}
            onChange={e => setEditProps({ ...editProps, icon: e.target.value })}
        >
            {icons.map(icon => (
                <MenuItem key={icon} value={icon}>
                    <img style={{ height: "20px", marginRight: "16px" }} src={resolve(iconPath, icon)} /> {" "}
                    {icon}
                </MenuItem>
            ))}
        </TextField>}

        {/* MacOS use his own spell checker */}
        {platform() !== "darwin" && <FormControl fullWidth>
            <InputLabel id="mutiple-languages-label">Spell checkers</InputLabel>
            <Select
                labelId="mutiple-languages-label"
                id="mutiple-languages-input"
                fullWidth
                multiple
                value={editProps.spellCheckers}
                onChange={e => setEditProps({ ...editProps, spellCheckers: (e.target.value as string[]) })}
                input={<Input id="select-languages-input" />}
                renderValue={(selected) => <div>{(selected as string[]).join(", ")}</div>}
            >
                {languages.map((name) => (
                    <MenuItem key={name} value={name}>
                        {name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>}

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "16px" }}>
            <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={() => {
                    setWindowProps(editProps);
                    setShowSnackbar("Changes saved, restart application to take effect!");
                }}>
                Save changes
            </Button>
            <Button
                variant="contained"
                color="default"
                startIcon={<AddIcon />}
                onClick={() => {
                    addWindow();
                    setShowSnackbar("Window added, restart application to take effect!");
                }}>
                Add window
            </Button>
            <Button
                variant="contained"
                color="secondary"
                startIcon={<DeleteIcon />}
                onClick={() => {
                    removeWindow();
                    setShowSnackbar("Window deleted, restart application to take effect!");
                }}>
                Delete window
            </Button>
        </div>

        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            open={showSnackbar !== null}
            autoHideDuration={5000}
            onClose={() => setShowSnackbar(null)}
        >
            <MySnackbarContentWrapper
                onClose={() => setShowSnackbar(null)}
                message={showSnackbar}
            />
        </Snackbar>
    </form>;
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
            message={<div style={{ display: "flex", alignItems: "center" }}>
                <CheckCircleIcon />
                {message}
            </div>}
            action={[
                <IconButton key="close" aria-label="close" color="inherit" onClick={onClose}>
                    <CloseIcon />
                </IconButton>,
            ]}
            {...other}
        />
    );
}