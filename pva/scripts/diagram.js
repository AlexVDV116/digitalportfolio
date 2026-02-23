export const DIAGRAM = `
flowchart TD
  %% =========================================================
  %% STYLES (kleuren per sectie/rol in PvA)
  %% =========================================================
  classDef ctx  fill:#e8f1ff,stroke:#1f5fbf,stroke-width:1px;
  classDef qst  fill:#eafff2,stroke:#1b7f3a,stroke-width:1px;
  classDef met  fill:#fff6e5,stroke:#b86b00,stroke-width:1px;
  classDef th   fill:#f3e8ff,stroke:#6d28d9,stroke-width:1px;
  classDef exec fill:#ffe8ef,stroke:#be123c,stroke-width:1px;
  classDef ctrl fill:#eef2f7,stroke:#334155,stroke-width:1px;

  %% Artefact variants (same color, dashed)
  classDef ctxArt  fill:#e8f1ff,stroke:#1f5fbf,stroke-width:1px,stroke-dasharray: 4 3;
  classDef qstArt  fill:#eafff2,stroke:#1b7f3a,stroke-width:1px,stroke-dasharray: 4 3;
  classDef metArt  fill:#fff6e5,stroke:#b86b00,stroke-width:1px,stroke-dasharray: 4 3;
  classDef thArt   fill:#f3e8ff,stroke:#6d28d9,stroke-width:1px,stroke-dasharray: 4 3;
  classDef execArt fill:#ffe8ef,stroke:#be123c,stroke-width:1px,stroke-dasharray: 4 3;
  classDef ctrlArt fill:#eef2f7,stroke:#334155,stroke-width:1px,stroke-dasharray: 4 3;

  %% Traceability node style
  classDef rule fill:#f6f6f6,stroke:#333,stroke-width:1px;

  %% =========================================================
  %% TRACEABILITY NODE
  %% =========================================================
  R0["Traceability: probleem → doel → vragen → methode/theorie → OC’s → uitvoering"]:::rule

  %% =========================================================
  %% STRUCTUUR PvA (hoofdstukken als keten)
  %% =========================================================
  H1["H1 Inleiding"]:::ctx --> H2["H2 Organisatiebeschrijving"]:::ctx --> H3["H3 Aanleiding"]:::ctx --> H4["H4 Probleemstelling"]:::ctx

  H4 --> H5["H5 Doelstelling"]:::qst
  H5 --> H51["H5.1 Praktische relevantie"]:::qst
  H5 --> H52["H5.2 Business case"]:::qst

  H5 --> H6["H6 Centrale onderzoeksvraag"]:::qst --> H7["H7 Deelvragen"]:::qst --> H71["H7.1 Werkwijze per deelvraag"]:::met --> H8["H8 Methodische verantwoording"]:::met

  %% Theoretisch kader + output
  H8 --> H9["H9 Theoretisch kader"]:::th --> OC["Output: Ontwerpcriteria (OC-1..OC-9)"]:::thArt

  %% Uitvoering + outputs
  OC --> H10["H10 Systeemontwikkelingsmethodes"]:::exec --> MVP["Output: MVP / prototype"]:::execArt

  %% Extra output van H10 (nieuw)
  H10 --> DOC["Output: Analyse, ontwerp en opleverdocumentatie"]:::execArt

  %% Projectbeheersing parallel aan uitvoering + outputs
  H10 --> H11["H11 Planning"]:::ctrl --> PL["Output: SMART mijlpalen & tijdlijn"]:::ctrlArt
  H10 --> H12["H12 Risicoanalyse"]:::ctrl --> RM["Output: risicomatrix + mitigaties"]:::ctrlArt

  %% OPTIONAL: concrete sub-output van H9
  H9 --> TM["Output: traceability matrix (literatuur ↔ OC ↔ evaluatie)"]:::thArt

  %% =========================================================
  %% TRACEABILITY LINKS (conceptueel)
  %% =========================================================
  H4 -.-> R0
  H5 -.-> R0
  H6 -.-> R0
  H71 -.-> R0
  H9 -.-> R0
  OC -.-> R0
  H10 -.-> R0
`.trim();
