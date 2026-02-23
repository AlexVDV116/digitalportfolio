# PvA Interactief Procesdiagram

Deze webpagina rendert een Mermaid flowchart die de opbouw/traceability van het Plan van Aanpak visualiseert.
De pagina biedt:

-   Hover tooltips per node
-   Click om details te tonen in een zijpaneel
-   Zoom (scroll) en pan (space+drag of middelste muisknop)

## Projectstructuur

-   `index.html` – pagina-structuur
-   `styles/main.css` – academische styling
-   `scripts/diagram.js` – Mermaid diagram
-   `scripts/nodeInfo.js` – tooltip/sidepanel content
-   `scripts/app.js` – rendering, interactiviteit, zoom/pan

## Runnen (VS Code)

Aanbevolen: Live Server

1. Installeer extension: "Live Server" (Ritwick Dey)
2. Rechtsklik `index.html` → "Open with Live Server"

Alternatief:

```bash
python -m http.server 8080
```
