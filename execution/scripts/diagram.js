export const EXECUTION_PHASE_DIAGRAM = `
flowchart TD

  %% ===== Styling =====
  classDef analysis fill:#eef2ff,stroke:#3730a3,stroke-width:1px;
  classDef design fill:#e0f2fe,stroke:#0369a1,stroke-width:1px;
  classDef build fill:#ecfdf5,stroke:#047857,stroke-width:1px;
  classDef validate fill:#fef9c3,stroke:#b45309,stroke-width:1px;
  classDef risk fill:#fee2e2,stroke:#b91c1c,stroke-width:1px;
  classDef out fill:#f9fafb,stroke:#6b7280,stroke-width:1px,stroke-dasharray:4 3;

  START["Fase 2 — Uitvoering"]:::analysis

  %% ===== Deelonderzoeken =====
  DV1["DV1 — Beveiligings- & architectuureisen"]:::analysis
  DV2["DV2 — Functionele & niet-functionele eisen"]:::analysis
  DV3["DV3 — Analyse bestaande LLM-integraties"]:::analysis
  DV4["DV4 — Communicatiearchitectuur"]:::design
  DV5["DV5 — Evaluatie & validatie"]:::validate

  START --> DV1 --> DV2 --> DV3 --> DV4 --> DV5

  %% ===== Ontwerpcriteria =====
  OC["Ontwerpcriteria (OC-1 t/m OC-9)"]:::design
  DV1 --> OC
  DV2 --> OC
  DV3 --> OC
  DV4 --> ARCH

  %% ===== Architectuur & MVP =====
  ARCH["Architectuurontwerp + Trust Boundaries"]:::design
  MVP["Realisatie MVP (VS-extensie + lokaal LLM)"]:::build

  OC --> ARCH --> MVP

  %% ===== Validatie =====
  FUNC["Functionele tests per OC"]:::validate
  USER["Gebruikerstests (10–12 devs)"]:::validate
  SEC["Security-validatie (STRIDE + inspectie)"]:::validate

  MVP --> FUNC
  MVP --> USER
  MVP --> SEC

  %% ===== Risico-mitigatie =====
  RISK1["R3/R9 — Toetsbaarheid & traceability"]:::risk
  RISK2["R8 — Gevoelige data verwerking"]:::risk
  RISK3["R4 — SDK beperkingen"]:::risk
  RISK4["R7 — Misleidende LLM-output"]:::risk

  DV1 --> RISK2
  ARCH --> RISK3
  FUNC --> RISK4
  OC --> RISK1

  %% ===== Evidence & beantwoording =====
  EVID["OC-validatiematrix (bewijs per criterium)"]:::out
  ANSWER["Empirische beantwoording centrale onderzoeksvraag"]:::out

  FUNC --> EVID
  USER --> EVID
  SEC --> EVID

  EVID --> ANSWER

`.trim();
