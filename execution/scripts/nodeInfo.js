export const NODE_INFO = {
    /* =========================
       FASE 2 — UITVOERING (overzicht)
    ========================= */

    START: {
        title: "Fase 2 — Uitvoering",
        tooltip: "Uitvoering van deelonderzoeken, ontwerp en validatie.",
        desc: `De uitvoeringsfase operationaliseert het Plan van Aanpak naar concrete deelonderzoeken, ontwerpbeslissingen en een gecontroleerde realisatie (MVP). 
  De centrale focus ligt op traceerbaarheid: bevindingen per deelvraag worden gekoppeld aan ontwerpcriteria, die vervolgens worden gevalideerd met aantoonbaar bewijs (tests, gebruikersevaluatie en security-inspectie).`,
    },

    /* =========================
       DEELONDERZOEKEN (DV1..DV5)
    ========================= */

    DV1: {
        title: "DV1 — Beveiligings- & architectuureisen",
        tooltip: "Open DV1 in de traceability graph ↗",
        desc: `Inventarisatie en analyse van security- en architectuureisen die bepalend zijn voor een veilige LLM-integratie binnen de context (o.a. trust boundaries, datastromen, isolation, logging, policy).
  Output wordt verwerkt in ontwerpcriteria en architectuurkeuzes.`,
        route: "../traceability/?focus=DV1",
    },

    DV2: {
        title: "DV2 — Functionele & niet-functionele eisen",
        tooltip: "Open DV2 in de traceability graph ↗",
        desc: `Uitwerking van functionele requirements en niet-functionele eisen (bijv. latency, betrouwbaarheid, onderhoudbaarheid, auditing, UX).
  Deze eisen vormen samen met DV1 input voor toetsbare ontwerpcriteria en acceptatievoorwaarden.`,
        route: "../traceability/?focus=DV2",
    },

    DV3: {
        title: "DV3 — Analyse bestaande LLM-integraties",
        tooltip: "Open DV3 in de traceability graph ↗",
        desc: `Analyse van bestaande integraties (IDE-assistents, plug-in architecturen, lokale LLM’s) om design patterns, risico’s en effectieve interactiemechanismen te identificeren.
  Doel: herbruikbare ontwerpprincipes onderbouwen en valkuilen expliciet maken.`,
        route: "../traceability/?focus=DV3",
    },

    DV4: {
        title: "DV4 — Ontwerp communicatie IDE ↔ LLM",
        tooltip: "Open DV4 in de traceability graph ↗",
        desc: `Concretisering van de communicatieketen tussen IDE en LLM: API-contracten, contextopbouw, prompts, tool-calling (indien van toepassing), en beveiligingsmaatregelen rondom data-minimalisatie en policy enforcement.`,
        route: "../traceability/?focus=DV4",
    },

    DV5: {
        title: "DV5 — Evaluatie & validatie",
        tooltip: "Open DV5 in de traceability graph ↗",
        desc: `Uitvoering van evaluaties om aan te tonen dat het ontwerp (en de MVP) voldoet aan de ontwerpcriteria.
  De evaluatie resulteert in evidence per criterium en vormt de empirische basis voor beantwoording van de centrale onderzoeksvraag.`,
        route: "../traceability/?focus=DV5",
    },

    /* =========================
       ONTWERPCRITERIA & ARCHITECTUUR
    ========================= */

    OC: {
        title: "Ontwerpcriteria (OC-1 t/m OC-9)",
        tooltip: "Open de bewijs-keten per OC ↗",
        desc: `De ontwerpcriteria vormen de brug tussen analyse/theorie en realisatie.
  Ze zijn expliciet en toetsbaar geformuleerd zodat evaluatie-uitkomsten direct herleidbaar zijn naar de gemaakte ontwerpkeuzes.`,
        route: "../oc/",
    },

    ARCH: {
        title: "Architectuurontwerp + Trust Boundaries",
        tooltip: "Architectuur met expliciete beveiligingsgrenzen.",
        desc: `Uitwerking van de doelarchitectuur inclusief componenten, datastromen en trust boundaries. 
  Hier worden risico’s en mitigaties ‘by design’ verwerkt (bijv. sandboxing, data-filtering, logging, least privilege).`,
    },

    MVP: {
        title: "Realisatie MVP (VS-extensie + lokaal LLM)",
        tooltip: "Prototype-implementatie van het ontwerp. ↗",
        desc: `Werkende implementatie waarmee ontwerpcriteria in de praktijk toetsbaar worden. 
  De MVP dient als empirisch toetsinstrument: niet “feature completeness”, maar aantoonbaarheid van kerncriteria staat centraal.`,
        route: "https://github.com/AlexVDV116",
    },

    /* =========================
       VALIDATIE
    ========================= */

    FUNC: {
        title: "Functionele tests per OC",
        tooltip: "Testcases gekoppeld aan criteria.",
        desc: `Gerichte tests die per ontwerpcriterium aantonen of het systeemgedrag overeenkomt met de beoogde werking. 
  Output wordt vastgelegd als evidence in de validatiematrix.`,
    },

    USER: {
        title: "Gebruikerstests (10–12 devs)",
        tooltip: "Bruikbaarheid en effectiviteit in de praktijk.",
        desc: `Gebruikerstests gericht op bruikbaarheid, werkbaarheid en ervaren waarde. 
  Resultaten worden geïnterpreteerd in relatie tot de ontwerpcriteria en de centrale onderzoeksvraag.`,
    },

    SEC: {
        title: "Security-validatie (STRIDE + inspectie)",
        tooltip: "Threat modeling + technische inspectie.",
        desc: `Validatie van beveiligingsaspecten via threat modeling (STRIDE) en technische inspectie. 
  Focus ligt op aantoonbare mitigatie van relevante dreigingen binnen de gekozen trust boundaries.`,
    },

    /* =========================
       RISICO’S & MITIGATIE
    ========================= */

    RISK1: {
        title: "R3/R9 — Toetsbaarheid & traceability",
        tooltip: "Risico op onvoldoende aantoonbaarheid.",
        desc: `Mitigatie: ontwerpcriteria operationaliseren, evidence per criterium vastleggen en expliciete koppelingen aan deelvragen behouden. 
  Doel is voorkomen dat evaluatie ‘los’ komt te staan van theorie en methode.`,
    },

    RISK2: {
        title: "R8 — Gevoelige data verwerking",
        tooltip: "Risico op onbedoelde blootstelling.",
        desc: `Mitigatie: data-minimalisatie, filtering, policy enforcement, logging/auditing en duidelijke gebruikersrichtlijnen. 
  Ontwerpkeuzes moeten aantoonbaar privacy- en security-by-design ondersteunen.`,
    },

    RISK3: {
        title: "R4 — SDK beperkingen",
        tooltip: "Technische beperkingen in extensie/SDK.",
        desc: `Mitigatie: proof-of-concepts, fallback-scenario’s, scopebewaking en expliciete ontwerpkeuzes met onderbouwing. 
  Doel: haalbaarheid borgen zonder methodische concessies.`,
    },

    RISK4: {
        title: "R7 — Misleidende LLM-output",
        tooltip: "Risico op onjuiste of overtuigende fouten.",
        desc: `Mitigatie: guardrails, transparante UX, bronvermelding waar mogelijk, en testscenario’s die failure-modes expliciet evalueren. 
  Doel: beheersbaarheid en verantwoord gebruik.`,
    },

    /* =========================
       EVIDENCE & BEANTWOORDING
    ========================= */

    EVID: {
        title: "OC-validatiematrix",
        tooltip: "Open de heatmap met OC × DV-dekking ↗",
        desc: `Geconsolideerde evidence per ontwerpcriterium, inclusief verwijzingen naar testresultaten, user study bevindingen en security-inspectie.
  Dit vormt de kern voor traceerbare conclusies.`,
        route: "../traceability/?tab=heatmap",
    },

    ANSWER: {
        title: "Empirische beantwoording centrale onderzoeksvraag",
        tooltip: "Conclusie op basis van evidence.",
        desc: `Samenvatting en interpretatie van de verzamelde evidence richting beantwoording van de centrale onderzoeksvraag. 
  De argumentatie volgt de methodische keten (vraag → methode → resultaat → conclusie → ontwerp/advies).`,
    },
};
