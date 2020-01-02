import * as React from "react";
import { render } from "react-dom";

import App from "./components/App";

export default function renderer(applicationIndex: number, body: HTMLElement) {
    render(<App index={applicationIndex} />, body);
}
