import { initDiagramPage } from "../../scripts/shared/diagramPage.js";
import { EXECUTION_PHASE_DIAGRAM } from "./diagram.js";
import { NODE_INFO } from "./nodeInfo.js";
import { initHamburgerNav } from "../../scripts/shared/nav.js";
import { initStoryMode } from "../../scripts/shared/storyMode.js";

initDiagramPage({
    diagramText: EXECUTION_PHASE_DIAGRAM,
    nodeInfoMap: NODE_INFO,
    mermaidId: "executionDiagram",
    zoomFactor: 1.0,
    offsetX: 50,
    offsetY: 0,
});

initHamburgerNav();
initStoryMode();
