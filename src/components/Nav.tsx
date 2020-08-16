import { resolve } from "path";

import * as React from "react";

import Dialog from '@material-ui/core/Dialog';
import SettingsIcon from '@material-ui/icons/Settings';
import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions';
import CircularProgress from '@material-ui/core/CircularProgress';
import Badge from '@material-ui/core/Badge';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Tooltip from '@material-ui/core/Tooltip';

import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import useContext from "./Context";
import Settings from "./Settings";

const iconPath = resolve(__filename, "..", "..", "..", "img", "icons");

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children?: React.ReactElement<any, any> },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function Nav() {

    const { items, activeItemIndex, setActiveItemIndex, addItem, setDynamicItemProps, changeOrder } = useContext();

    const [showSettings, setShowSettings] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [showContextMenu, setShowContextMenu] = React.useState<null | number>(null);

    const activeItem = items[activeItemIndex] || { static: { color: "primary" } };

    return <>
        <Tabs
            style={{ width: "150px", zIndex: 10 }}
            orientation="vertical"
            variant="scrollable"
            value={activeItemIndex}
            indicatorColor={activeItem.static.color}
            textColor={activeItem.static.color}
        >
            {items.map((item, i) => <Tooltip key={i} title={item.dynamic.title} placement="right">
                <Tab
                    aria-describedby={`nav-item-${i}`}
                    color={item.static.color}
                    icon={<Badge color={item.static.color} badgeContent={item.dynamic.alert}>
                        <img alt={item.static.name} src={resolve(iconPath, item.static.icon)} style={{ maxWidth: "32px" }} />
                    </Badge>}
                    label={item.static.name}
                    onClick={() => setActiveItemIndex(i)}
                    onContextMenu={e => {
                        setAnchorEl(e.target);
                        setShowContextMenu(i);
                    }}
                />
            </Tooltip>)}

            <Tab key={"add"} label={"Add item"} icon={<AddIcon />} onClick={async () => {
                await addItem({
                    id: null,
                    order: 100,
                    name: "New item",
                    icon: "icon.png",
                    color: "primary",
                    url: "https://github.com/ingSlonik/queeg/",
                    partition: "persist:personal",
                    shortText: "",
                    alert: null,
                });
            }} />

            <Tab key={"settings"} icon={<SettingsIcon />} label="Settings" onClick={() => setShowSettings(true)} />

        </Tabs>

        <Menu
            id={`nav-item-${showContextMenu}`}
            open={showContextMenu !== null}
            anchorEl={anchorEl}
            keepMounted
            onClose={() => setShowContextMenu(null)}
        >
            <MenuItem button={false}><b>{items[showContextMenu] && items[showContextMenu].static.name}</b></MenuItem>
            <MenuItem onClick={() => {
                items[showContextMenu] && setDynamicItemProps(showContextMenu, dynamic => ({ ...dynamic, reload: true }));
                setShowContextMenu(null);
            }} >
                Reload
            </MenuItem>
            <MenuItem onClick={() => {
                items[showContextMenu] && setDynamicItemProps(showContextMenu, dynamic => ({ ...dynamic, showForm: true }));
                setShowContextMenu(null);
            }}>
                Edit
            </MenuItem>
            <MenuItem onClick={() => {
                changeOrder(showContextMenu, "up");
                setShowContextMenu(null);
            }}>
                Move up
            </MenuItem>
            <MenuItem onClick={() => {
                changeOrder(showContextMenu, "down");
                setShowContextMenu(null);
            }}>
                Move down
            </MenuItem>
        </Menu>

        <Dialog fullScreen open={showSettings} onClose={() => setShowSettings(false)} TransitionComponent={Transition}>
            <Settings onClose={() => setShowSettings(false)} />
        </Dialog>
    </>;
}
