export const DIAGRAM = `
flowchart LR

  %% ===== Phase styling =====
  classDef prep fill:#e8f1ff,stroke:#1f5fbf,stroke-width:1px;
  classDef exec fill:#eafff2,stroke:#1b7f3a,stroke-width:1px;
  classDef fin  fill:#f3e8ff,stroke:#6d28d9,stroke-width:1px;

  %% ===== Artefacts per phase (same fill/stroke, dashed) =====
  classDef prepArt fill:#e8f1ff,stroke:#1f5fbf,stroke-width:1px,stroke-dasharray: 4 3;
  classDef execArt fill:#eafff2,stroke:#1b7f3a,stroke-width:1px,stroke-dasharray: 4 3;
  classDef finArt  fill:#f3e8ff,stroke:#6d28d9,stroke-width:1px,stroke-dasharray: 4 3;
  classDef sharedArt fill:#ffffff,stroke:#6b7280,stroke-width:1px,stroke-dasharray: 4 3;

  %% ===== Other nodes (neutral) =====
  classDef out fill:#f9fafb,stroke:#6b7280,stroke-width:1px;

  START["Ontwerpgericht Onderzoek"]:::out

  PREP["Fase 1 — Voorbereiding"]:::prep
  EXEC["Fase 2 — Uitvoering"]:::exec
  FIN["Fase 3 — Afronding"]:::fin

  START --> PREP --> EXEC --> FIN

  %% ===== Doorlopend (alle fasen) =====
  START --> STATUS["Projectstatusrapport (2-wekelijks)"]:::sharedArt
  START --> REFLECT["Wekelijkse zelfreflectie"]:::sharedArt
  START --> MTM["Master Traceability Matrix"]:::sharedArt

  %% ===== Voorbereiding =====
  PREP --> SIGNUP["Aanmeldformulier"]:::prepArt
  PREP --> PVA["Plan van Aanpak (PvA)"]:::prepArt
  PREP --> PLAN["Planning & Risicoanalyse"]:::prep
  PREP --> THEORY["Theoretisch kader"]:::prepArt

  %% ===== Uitvoering =====
  EXEC --> DV["Deelonderzoeken (DV1–DV5)"]:::exec
  DV --> DOC["Analyse, ontwerp & opleverdocumentatie"]:::execArt
  DV --> MVP["MVP / Realisatie (werkende applicatie)"]:::execArt
  MVP --> EVAL["Testen & validatie (resultaten)"]:::exec

  EXEC --> BCOMP["Beoordeling bedrijfsbegeleider"]:::execArt
  EXEC --> DEMO["Presentatie + demo video (uitleg)"]:::execArt
  EXEC --> CODE["Programmeercode (alleen op verzoek)"]:::execArt

  %% ===== Afronding =====
  FIN --> REPORT["Eindverslag (concept + definitief)"]:::finArt
  FIN --> SUST["Duurzaamheidsverslag (bijlage)"]:::finArt
  FIN --> STARR["STARR reflectieverslag (bijlage)"]:::finArt
  FIN --> APPX["Bijlagen: documentatie (deel)onderzoeken"]:::finArt
  FIN --> DEF["Presentatie & verdediging"]:::fin

  %% Relaties tussen belangrijke onderdelen
  PVA -.-> MVP
  DOC -.-> REPORT
  DEMO -.-> DEF
  BCOMP -.-> REPORT
  APPX -.-> REPORT
`.trim();
