import * as React from "react";

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import Box from '@material-ui/core/Box';

import useContext from "./Context";
import ItemForm from "./FormItem";
import Nav from "./Nav";

type SettingsProps = {
    onClose: () => void,
};

export default function Settings({ onClose }: SettingsProps) {

    const { items, activeItemIndex } = useContext();

    return <>
        <AppBar position="static">
            <Toolbar>
                <IconButton edge="start" color="inherit" onClick={onClose}>
                    <CloseIcon />
                </IconButton>
                <Typography variant="h6">
                    Setting
                </Typography>
            </Toolbar>
        </AppBar>

        <div style={{ display: "flex" }}>
            <Nav isSetting={true} />
            <div style={{ flexGrow: 1, flexBasis: "100px" }}>
                {items.map((item, i) => <TabPanel key={item.static.id} value={activeItemIndex} index={i}>
                    <ItemForm id={item.static.id} />
                </TabPanel>)}
            </div>
        </div>
    </>;
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            <Box p={3}>{children}</Box>
        </Typography>
    );
}
