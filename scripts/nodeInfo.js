export const NODE_INFO = {
    /* =========================================================
       OVERKOEPELEND
    ========================================================= */

    START: {
        title: "Ontwerpgericht Onderzoek",
        tooltip: "Volledig afstudeertraject van voorbereiding tot afronding.",
        desc: "Dit digitale research portfolio omvat het volledige ontwerpgerichte afstudeeronderzoek: van probleemstelling en Plan van Aanpak tot uitvoering, evaluatie en afronding met verdediging.",
    },

    STATUS: {
        title: "Projectstatusrapport",
        tooltip: "2-wekelijks voortgang ↗",
        desc: "Doorlopende voortgangsrapportage (max. 2 A4) gedurende alle fasen. Hierin wordt inhoudelijke voortgang, besluitvorming, knelpunten en planning verantwoord.",
        route: "https://avans-my.sharepoint.com/:f:/r/personal/a_vandervelden3_student_avans_nl/Documents/Jaar%204/Afstuderen/Projectstatusrapportages?csf=1&web=1&e=rwkweP",
    },

    REFLECT: {
        title: "Wekelijkse zelfreflectie",
        tooltip:
            '"We do not learn from experience... we learn from reflecting on experience." — John Dewey ↗',
        desc: `Gedurende het afstudeertraject worden wekelijkse zelfreflecties opgesteld om het leerproces expliciet, systematisch en toetsbaar te maken.

Zoals John Dewey stelt: “We do not learn from experience… we learn from reflecting on experience.”

De reflecties zijn gestructureerd volgens het STARR-model (Situatie, Taak, Actie, Resultaat, Reflectie) en tonen aantoonbaar professionele ontwikkeling, methodisch bewustzijn en zelfstandig leren.`,
        route: "https://avans-my.sharepoint.com/:f:/r/personal/a_vandervelden3_student_avans_nl/Documents/Jaar%204/Afstuderen/Zelfreflecties?csf=1&web=1&e=CIjF7s",
    },

    MTM: {
        title: "Master Traceability Matrix",
        tooltip: "Overzicht van traceability over tabbladen ↗",
        desc: `De master traceability matrix brengt de logische herleidbaarheid van het onderzoek integraal in kaart.
      Hierin worden o.a. probleemstelling, (deel)vragen, methodische keuzes, bevindingen, ontwerpcriteria en bewijsvoering aan elkaar gekoppeld.
      
      Deze weergave is bewust opgenomen in het digitale portfolio, zodat de traceability niet uitsluitend in een los Excel-bestand bestaat, maar ook tijdens evaluatie en verdediging interactief navigeerbaar is.`,
        route: "./traceability/",
    },

    THEORY: {
        title: "Theoretisch kader",
        tooltip: "Literatuur → synthese → ontwerpcriteria ↗",
        desc: "Overzicht van gekozen literatuur, synthese-inzichten en de vertaling naar OC’s.",
        route: "./theory/",
    },

    /* =========================================================
       FASE 1 — VOORBEREIDING
    ========================================================= */

    PREP: {
        title: "Fase 1 — Voorbereiding",
        tooltip: "Probleemdefinitie, theorie, methode en GO/NOGO.",
        desc: "In deze fase wordt het onderzoek inhoudelijk en methodisch voorbereid. Dit resulteert in een volledig uitgewerkt Plan van Aanpak dat ter goedkeuring wordt voorgelegd (GO/NOGO-moment).",
    },

    SIGNUP: {
        title: "Aanmeldformulier",
        tooltip: "Formele start van het afstudeertraject ↗",
        desc: `Het aanmeldformulier markeert de formele start van het afstudeertraject en wordt beoordeeld op niveau, complexiteit en praktijkrelevantie. Goedkeuring betekent dat het onderzoek inhoudelijk geschikt wordt geacht om te starten.`,
        route: "https://avans-my.sharepoint.com/:b:/r/personal/a_vandervelden3_student_avans_nl/Documents/Jaar%204/Afstuderen/Voorbereiding/aanmeldformulier_afstuderen_informatica_alexvdvelden.pdf?csf=1&web=1&e=EJSNXJ",
    },

    PVA: {
        title: "Plan van Aanpak (PvA)",
        tooltip: "Onderzoeksopzet + GO/NOGO ↗",
        desc: "Het Plan van Aanpak beschrijft context, probleemstelling, doelstelling, onderzoeksvragen, theoretisch kader, methodische aanpak, planning en risicoanalyse. Dit document vormt het fundament voor uitvoering en eindrapportage.",
        route: "./pva/",
    },

    PLAN: {
        title: "Planning & Risicoanalyse",
        tooltip: "Fasering, mijlpalen en risicobeheersing ↗",
        desc: "Overzicht van de 20-wekenplanning inclusief SMART-mijlpalen en geïdentificeerde risico’s met bijbehorende beheersmaatregelen. Borgt voortgang en haalbaarheid.",
        route: "./timeline/",
    },

    /* =========================================================
       FASE 2 — UITVOERING
    ========================================================= */

    EXEC: {
        title: "Fase 2 — Uitvoering",
        tooltip: "Onderzoek → ontwerp → realisatie → evaluatie. ↗",
        desc: "In deze fase worden deelvragen beantwoord via analyse en synthese. Ontwerpcriteria worden vertaald naar concrete eisen en ontwerpkeuzes, waarna een prototype wordt gerealiseerd en gevalideerd.",
        route: "./execution/",
    },

    DV: {
        title: "Deelonderzoeken (DV1–DV5)",
        tooltip: "Uitwerking van deelvragen en vertaling naar ontwerpcriteria.",
        desc: `
        <p>In deze fase voer ik de deelonderzoeken (DV1–DV5) uit zoals vastgelegd in het Plan van Aanpak. Hier worden de deelvragen daadwerkelijk onderzocht en vertaald naar concrete ontwerpcriteria.</p>
    
        <p>De resultaten vormen de basis voor het architectuurontwerp, de realisatie van de MVP en de validatie. Het volledige stappenplan en de onderlinge samenhang zijn uitgewerkt in het uitvoeringsdiagram.</p>
    `,
    },

    MVP: {
        title: "MVP / Realisatie",
        tooltip: "Werkende applicatie ↗",
        desc: "De gerealiseerde prototype-oplossing waarmee ontwerpcriteria empirisch worden getoetst op bruikbaarheid, effectiviteit en technische haalbaarheid.",
        route: "https://github.com/AlexVDV116",
    },

    DOC: {
        title: "Analyse, Ontwerp & Opleverdocumentatie",
        tooltip: "Technische onderbouwing ↗",
        desc: "Documentatie van analyse, architectuurkeuzes, ontwerpbeslissingen en opleverinformatie. Ondersteunt reproduceerbaarheid en overdraagbaarheid.",
        route: "https://avans-my.sharepoint.com/:f:/r/personal/a_vandervelden3_student_avans_nl/Documents/Jaar%204/Afstuderen?csf=1&web=1&e=82KdG2",
    },

    BCOMP: {
        title: "Beoordeling bedrijfsbegeleider",
        tooltip: "Praktijkbeoordeling uitvoering ↗",
        desc: "Formele beoordeling van de uitvoering door de bedrijfsbegeleider. Beoordeelt kwaliteit, professionaliteit, zelfstandigheid en toepasbaarheid van de oplossing.",
        route: "https://avans-my.sharepoint.com/:f:/r/personal/a_vandervelden3_student_avans_nl/Documents/Jaar%204/Afstuderen?csf=1&web=1&e=82KdG2",
    },

    DEMO: {
        title: "Demo van realisatie (Video)",
        tooltip: "Video met uitleg, screen recording. ↗",
        desc: "Video-opname waarin de oplossing wordt gedemonstreerd en toegelicht. Verbindt ontwerpkeuzes aan onderzoeksvragen en ontwerpcriteria.",
        route: "https://avans-my.sharepoint.com/:f:/r/personal/a_vandervelden3_student_avans_nl/Documents/Jaar%204/Afstuderen?csf=1&web=1&e=82KdG2",
    },

    EVAL: {
        title: "Testen & Validatie",
        tooltip: "Toetsing van ontwerpcriteria.",
        desc: "Evaluatie van de gerealiseerde oplossing aan de hand van ontwerpcriteria en onderzoeksvragen. Onderbouwt de beantwoording van de deelvragen.",
    },

    CODE: {
        title: "Programmeercode",
        tooltip: "Broncode van realisatie. ↗",
        desc: "De broncode van de applicatie wordt uitsluitend verstrekt indien examinatoren hier expliciet om verzoeken.",
        route: "https://github.com/AlexVDV116",
    },

    /* =========================================================
       FASE 3 — AFRONDING
    ========================================================= */

    FIN: {
        title: "Fase 3 — Afronding",
        tooltip: "Eindverslag en verdediging.",
        desc: "In deze fase wordt het onderzoek formeel verantwoord in het eindverslag en verdedigd tijdens de presentatie.",
    },

    REPORT: {
        title: "Eindverslag (concept + definitief)",
        tooltip: "Definitief onderzoeksrapport ↗",
        desc: "Het eindverslag bevat onder meer inleiding, methode, theoretisch kader, uitvoering, resultaten, conclusie, aanbevelingen, zelfevaluatie en literatuurverantwoording conform APA.",
        route: "./report/",
    },

    SUST: {
        title: "Duurzaamheidsverslag",
        tooltip: "Duurzaamheidsanalyse ↗",
        desc: "Bijlage waarin duurzaamheid in technische, organisatorische en maatschappelijke context wordt geanalyseerd.",
        route: "https://avans-my.sharepoint.com/:f:/r/personal/a_vandervelden3_student_avans_nl/Documents/Jaar%204/Afstuderen?csf=1&web=1&e=82KdG2",
    },

    STARR: {
        title: "STARR Reflectieverslag",
        tooltip: "Formele zelfevaluatie ↗",
        desc: "Zelfevaluatie volgens het STARR-model waarin professioneel handelen en ontwikkeling gedurende het traject kritisch worden geanalyseerd.",
        route: "https://avans-my.sharepoint.com/:f:/r/personal/a_vandervelden3_student_avans_nl/Documents/Jaar%204/Afstuderen?csf=1&web=1&e=82KdG2",
    },

    APPX: {
        title: "Bijlagen Deelonderzoeken",
        tooltip: "Onderliggende documentatie ↗",
        desc: "Verzameling van analysebestanden, ontwerpdocumentatie, evaluatiegegevens en overige bewijsstukken die de traceerbaarheid van het onderzoek ondersteunen.",
        route: "https://avans-my.sharepoint.com/:f:/r/personal/a_vandervelden3_student_avans_nl/Documents/Jaar%204/Afstuderen?csf=1&web=1&e=82KdG2",
    },

    DEF: {
        title: "Presentatie & Verdediging",
        tooltip: "Mondelinge toelichting en beoordeling.",
        desc: "Openbare presentatie van het onderzoek, gevolgd door een verdediging waarin methodiek, ontwerpkeuzes, resultaten en reflectie worden bevraagd.",
    },
};
