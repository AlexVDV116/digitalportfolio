import { initDiagramPage } from "./shared/diagramPage.js";
import { DIAGRAM } from "./diagram.js";
import { NODE_INFO } from "./nodeInfo.js";
import { initHamburgerNav } from "../scripts/shared/nav.js";

initDiagramPage({
    diagramText: DIAGRAM,
    nodeInfoMap: NODE_INFO,
    mermaidId: "landingDiagram",
    zoomFactor: 1.75,
    offsetX: 450,
    offsetY: 150,
});

initHamburgerNav();
