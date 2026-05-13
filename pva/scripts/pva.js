import { initDiagramPage } from "../../scripts/shared/diagramPage.js";
import { DIAGRAM } from "./diagram.js";
import { NODE_INFO } from "./nodeInfo.js";
import { initHamburgerNav } from "../../scripts/shared/nav.js";
import { initStoryMode } from "../../scripts/shared/storyMode.js";

initDiagramPage({
    diagramText: DIAGRAM,
    nodeInfoMap: NODE_INFO,
    mermaidId: "pvaDiagram",
    zoomFactor: 1.75,
    offsetX: 300,
    offsetY: 350,
    traceTargetId: "R0",
});

initHamburgerNav();
initStoryMode();
