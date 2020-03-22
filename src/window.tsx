import * as React from "react";
import { render } from "react-dom";

import App from "./components/App";

export default function renderer(windowId: number, body: HTMLElement) {
    render(<App windowId={windowId} />, body);
}
