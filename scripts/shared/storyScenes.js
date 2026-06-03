import { METRICS } from "./researchMetrics.js";

/**
 * Geleide verdedigings-flow door het portfolio (herontwerp o.b.v. eindverslag v5).
 *
 * Onderzoekslijn: Context → Hoofdvraag → DV1 … DV5 → Theorie → Ontwerpcriteria
 *   → Realisatie → Validatie → Roadmap → Beantwoording hoofdvraag.
 *
 * Narration = inhoudelijke samenvatting van de stap in het onderzoek.
 * Geschikt om meegelezen te worden door beoordelaars.
 *
 * Paden zijn relatief aan de portfolio-root.
 * Productie (GitHub Pages): `/digitalportfolio/<path>` · Lokaal: `/<path>`.
 */
export const STORY_SCENES = [
    {
        id: "context",
        chapter: "Aanleiding",
        title: "Context en probleemstelling",
        narration:
            "Softwareontwikkelaars bij Defensie werken in een gesloten netwerk zonder toegang tot cloudgebaseerde AI-assistenten. Gangbare tools zoals GitHub Copilot verwerken code via externe servers, wat niet is toegestaan. Hierdoor ontstaat een spanningsveld: de potentiële voordelen van LLM-ondersteuning zijn beschikbaar in de markt, maar buiten bereik voor deze ontwikkelomgeving.",
        path: "",
    },
    {
        id: "onderzoeksvraag",
        chapter: "Onderzoeksvraag",
        title: "Centrale onderzoeksvraag en deelvragen",
        narration:
            "De centrale vraag luidt: hoe kan een lokaal gehost LLM veilig en beheersbaar worden geïntegreerd in Visual Studio 2022 binnen een gesloten defensieomgeving? De vraag is uitgewerkt in vijf deelvragen die de stap-voor-stap opbouw van het onderzoek weerspiegelen: van beveiligingskaders en gebruikersbehoeften via ontwerpkeuzes naar evaluatie.",
        path: "#glance",
    },
    {
        id: "dv1",
        chapter: "Deelvraag 1",
        title: "DV1 — Beveiligings- en architectuureisen",
        narration:
            "Documentanalyse van het Defensie Beveiligingsbeleid, de D/300-serie en de BIO bracht de beveiligings- en architectuureisen voor de extensie in kaart. De centrale conclusie: lokale modelhosting alléén is niet voldoende. Veilige integratie vereist ook dataminimalisatie, geen persistente opslag van gevoelige gegevens, expliciete contextbeperking en gescheiden verantwoordelijkheden.",
        path: "deelvragen/#dv1",
    },
    {
        id: "dv2",
        chapter: "Deelvraag 2",
        title: "DV2 — Functionele en niet-functionele eisen",
        narration:
            "Semigestructureerde interviews met ontwikkelaars leverden de functionele en niet-functionele eisen op. De extensie heeft de meeste waarde als zij direct aansluit op de Visual Studio-workflow: code uitleggen, refactoring en testvoorbereiding. Gebruikers willen zicht op de context die wordt meegestuurd en de mogelijkheid om modeloutput handmatig te beoordelen voordat deze wordt toegepast.",
        path: "deelvragen/#dv2",
    },
    {
        id: "dv3",
        chapter: "Deelvraag 3",
        title: "DV3 — Ontwerpprincipes uit bestaande integraties",
        narration:
            "Een vergelijkende analyse van Continue, BroPilot en LocalStudio identificeerde bruikbare ontwerpprincipes voor IDE-integratie. Bestaande tools zijn breed van opzet; voor de defensieomgeving zijn juist beperkte, controleerbare varianten relevant. De meest toepasbare principes zijn expliciete contextselectie, een aparte clientlaag voor modelcommunicatie en het aanbieden van output als voorstel.",
        path: "deelvragen/#dv3",
    },
    {
        id: "dv4",
        chapter: "Deelvraag 4",
        title: "DV4 — Communicatiearchitectuur",
        narration:
            "De ontwerpcriteria en eisen zijn vertaald naar een communicatiearchitectuur. De extensie fungeert als een gecontroleerde client tussen de IDE en het interne LLM-endpoint. Context wordt begrensd samengesteld, het request via een expliciete clientlaag verstuurd en fouten afgehandeld zonder dat de IDE instabiel wordt. Het LLM krijgt geen directe toegang tot bestanden, projectstructuren of IDE-functionaliteit.",
        path: "deelvragen/#dv4",
    },
    {
        id: "dv5",
        chapter: "Deelvraag 5",
        title: "DV5 — Evaluatie en validatie",
        narration:
            "De evaluatie combineert statische code- en architectuuranalyse, een beveiligingsevaluatie via STRIDE en OWASP LLM Top 10, en een praktijkvalidatie met gebruikers. De MVP voldoet binnen de onderzochte scope aan de gestelde eisen voor informatiebeveiliging, bruikbaarheid en effectiviteit. De uitgewerkte resultaten zijn te vinden op de evaluatiepagina.",
        path: "deelvragen/#dv5",
    },
    {
        id: "theorie",
        chapter: "Theoretisch kader",
        title: "Theoretisch kader — drie domeinen",
        narration:
            "Het theoretisch kader is opgebouwd rond drie domeinen: LLM-gedrag en outputkwaliteit, informatiebeveiliging in gesloten omgevingen, en IDE-integratie en extensiearchitectuur. De overlap tussen deze domeinen levert de spanningsvelden op die het ontwerp sturen — met name de spanning tussen contextkwaliteit en dataminimalisatie.",
        path: "theory/",
    },
    {
        id: "synthese",
        chapter: "Theoretisch kader",
        title: "Van literatuur naar ontwerpcriteria",
        narration:
            "De literatuur uit de drie domeinen is via synthese-inzichten vertaald naar negen ontwerpcriteria. Deze vertaling maakt elke ontwerpkeuze herleidbaar naar een theoretische of normatieve bron. De ontwerpcriteria vormen de brug tussen het theoretisch kader en de technische realisatie.",
        path: "theory/#sankey",
    },
    {
        id: "ontwerpcriteria",
        chapter: "Ontwerpcriteria",
        title: "Negen ontwerpcriteria",
        narration:
            "De negen ontwerpcriteria (OC-1 t/m OC-9) zijn het toetsbare kader waaraan het ontwerp en de evaluatie zijn gebaseerd. Elk criterium is herleidbaar naar een deelvraag en literatuurbron, heeft bijbehorende requirements en is aantoonbaar terug te vinden in de implementatie. OC-2 (contextbeperking) illustreert deze keten: van eis via ContextMode-ceiling naar 26 tests die het gedrag bewaken.",
        path: "oc/?id=OC-2",
    },
    {
        id: "realisatie",
        chapter: "Realisatie",
        title: "Architectuur en MVP",
        narration:
            "De MVP is een Visual Studio 2022-extensie met een gelaagde architectuur (Core, VSIX, Tests). De Core-laag heeft geen directe VS SDK-afhankelijkheden, waardoor de kernlogica buiten het VS-proces testbaar is. De trust boundaries laten zien welke verantwoordelijkheden bij welk onderdeel liggen: het model heeft geen toegang tot de codebase, context of IDE buiten wat de extensie expliciet doorstuurt.",
        path: "realisatie/",
    },
    {
        id: "validatie-technisch",
        chapter: "Evaluatie",
        title: "Technische validatie",
        narration: `De statische evaluatie (uitgevoerd op v0.4) toont aan dat alle negen ontwerpcriteria zijn gerealiseerd. De testsuite bevat ${METRICS.tests.total} MSTest-cases met 0 failures; de kernscope haalt ~${METRICS.tests.coreLine}% lijn-dekking. De STRIDE- en OWASP-analyse leverde geen kritieke bevindingen op. Restrisico's bij prompt injection en overreliance zijn gedocumenteerd.`,
        path: "evaluation/?tab=technical",
    },
    {
        id: "validatie-gat",
        chapter: "Evaluatie",
        title: "Praktijkevaluatie — gebruikersacceptatietest",
        narration:
            "De gebruikersacceptatietest is uitgevoerd met vijf ontwikkelaars uit de doelgroep (JIVC SO&I) op MVP-versie v0.3, gedurende twee weken vrij gebruik. Het gemiddelde rapportcijfer is 7,4 op 10; de aanbevelingsscore 8,2. De human-in-the-loop-aanpak scoort het sterkst (4,8/5). De NFR-2 responstijdeis is in de productieomgeving gehaald: p95 = 4,27 s.",
        path: "evaluation/?tab=gat",
    },
    {
        id: "heatmap",
        chapter: "Evaluatie",
        title: "Dekking in één oogopslag",
        narration:
            "De heatmap toont per ontwerpcriterium vanuit welke deelvragen er onderbouwing is. Geen enkel criterium heeft een lege kolom: elk OC is herleidbaar naar ten minste één deelvraag. OC-2 en OC-4 zijn het zwaarst onderbouwd, wat overeenkomt met hun centrale rol in de beveiligings- en beheersbaarheidscontext.",
        path: "traceability/?tab=heatmap",
    },
    {
        id: "roadmap",
        chapter: "Toekomst",
        title: "Ontwikkelroadmap",
        narration:
            "De roadmap laat de iteratieve ontwikkeling zien van v0.1 (conceptarchitectuur) via v0.4 (evaluatiebasis voor DV5) naar de huidige versie v0.5, waarin gebruikersfeedback uit de GAT is verwerkt. De stippellijn markeert de grens van de onderzoeksscope. Versie 1.0 valt buiten het onderzoek en vertegenwoordigt een afdelingsrelease na overdracht.",
        path: "roadmap/",
    },
    {
        id: "roadmap-methodologie",
        chapter: "Toekomst",
        title: "Koppeling aan de onderzoeksmethodiek",
        narration:
            "Elke versie in de roadmap correspondeert met een fase in de design cycle van Wieringa: vroege versies richten zich op haalbaarheid (DV4), middenversies op evaluatie (DV5), en latere versies op verfijning en overdracht. Dit maakt de relatie tussen de versie-iteraties en de onderzoeksfasen expliciet.",
        path: "roadmap/#methodSection",
    },
    {
        id: "conclusie",
        chapter: "Conclusie",
        title: "Beantwoording van de hoofdvraag",
        narration: `De centrale onderzoeksvraag kan positief worden beantwoord, maar afgebakend: een lokaal of intern gehost LLM kan veilig en beheersbaar worden geïntegreerd in Visual Studio 2022 binnen het gesloten Defensienetwerk, mits context, opslag, communicatie en toepassing van output expliciet worden begrensd. De evaluatie onderbouwt dit met ${METRICS.research.oc} voldane ontwerpcriteria, ${METRICS.tests.total} MSTest-cases en een rapportcijfer van 7,4.`,
        path: "conclusie/#antwoord",
    },
    {
        id: "bijdrage",
        chapter: "Conclusie",
        title: "Onderzoeksbijdrage",
        narration:
            "De negen ontwerpcriteria zijn toegepast op één omgeving, maar de onderliggende principes zijn breder overdraagbaar. Zij vormen negen ontwerpprincipes voor veilige AI-integratie in gesloten of gereguleerde omgevingen — afgeleid uit de literatuur, toegepast en gevalideerd binnen deze casus, en plausibel toepasbaar binnen sectoren als overheid, zorg, de financiële sector en de industrie. De principes zijn niet als universeel bewezen gepresenteerd; hun waarde ligt in de afwegingen die zij zichtbaar maken.",
        path: "conclusie/#bijdrage",
    },
    {
        id: "grenzen",
        chapter: "Conclusie",
        title: "Grenzen van het onderzoek",
        narration:
            "Het onderzoek kent drie expliciete beperkingen: een beperkte gebruikersgroep (vijf respondenten op v0.3, als praktijkindicatie), een context-afhankelijke responstijd (NFR-2 gehaald in productie, niet op lokale hardware) en een enkelvoudige organisatiecontext die de externe geldigheid begrenst. Deze beperkingen verminderen de waarde van het onderzoek niet, maar kaderen de conclusies correct in en geven richting aan vervolgstappen.",
        path: "conclusie/#grenzen",
    },
];
