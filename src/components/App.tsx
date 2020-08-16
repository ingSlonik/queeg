import { resolve } from "path";

import * as React from "react";

import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import useContext, { Provider } from "./Context";

import Nav from "./Nav";
import Content from "./Content";
import Switch from "./Switch";

const iconPath = resolve(__filename, "..", "..", "..", "img", "icons");

type AppProps = {
    windowId: number,
};

export default function App({ windowId }: AppProps) {
    const { nav } = useContext();

    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    const theme = React.useMemo(() => createMuiTheme(
        {
            palette: {
                type: prefersDarkMode ? 'dark' : 'light',
            },
        }),
        [prefersDarkMode],
    );

    return <Provider windowId={windowId}>
        <ThemeProvider theme={theme}>
            <div id="wrap" className={`MuiPaper-root ${nav.position}`}>
                <Switch />
                <Nav />
                <Content />
            </div>
        </ThemeProvider>
    </Provider>;
}