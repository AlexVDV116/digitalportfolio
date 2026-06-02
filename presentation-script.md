# Presentatiescript — Verdediging Afstudeeronderzoek

**Onderwerp:** Veilige en beheersbare integratie van een lokaal gehost Large Language Model in Visual Studio 2022 binnen een gesloten Defensieomgeving.

Dit script begeleidt de **🎓 Tour** in het digitale portfolio. Vijftien scènes, ongeveer acht tot negen minuten spreektijd, voor de inleiding van de verdediging. Per scène staat:

- **Spreekdoel** — wat de commissie na deze scène moet begrijpen
- **Wat de commissie ziet** — wat op het scherm staat
- **Spreektekst** — wat ik mondeling vertel (natuurlijke toon, niet voorlezen)
- **Overgang** — de zin waarmee ik doorloop naar de volgende scène

De rode draad door alle scènes is dezelfde keten die het portfolio centraal stelt: **theorie → ontwerpcriteria → requirements → ontwerpbeslissingen → code/MVP → tests en evaluatie → praktijkvalidatie → roadmap → conclusie**. Bij elke stap maak ik traceability expliciet.

> **Tip vóór de start:** open het portfolio in fullscreen, klik op `🎓 Tour` en gebruik de spatiebalk of pijl-rechts om door te bladeren. `Esc` om de tour te sluiten als de commissie wil ingrijpen.

---

## Opening — vóór scène 1

> *Voordat ik in het onderzoek duik, één opmerking over dit portfolio. Het is geen los presentatiebestand. Het is een interactief onderzoekslandschap dat ik gedurende het traject heb gebouwd om de samenhang tussen theorie, ontwerp en realisatie zichtbaar te maken. Tijdens deze inleiding loop ik er stap voor stap doorheen.*

---

## Scène 1 — Probleem & centrale onderzoeksvraag

**Spreekdoel:** de commissie begrijpt waarom dit onderzoek nodig was en welke vraag eraan ten grondslag ligt.

**Wat de commissie ziet:** landingspagina met de centrale onderzoeksvraag in een geciteerd kader.

**Spreektekst:**
> *Binnen Defensie werken ontwikkelaars in air-gapped netwerken. Dat betekent geen GitHub Copilot, geen ChatGPT, geen externe AI-diensten — terwijl die tools elders in de markt de productiviteit fors verhogen. Tegelijk bestaat er bij de organisatie wel een wens om de voordelen van LLM-ondersteuning te benutten, maar dan zónder de beveiligingsrandvoorwaarden te schenden. Mijn centrale onderzoeksvraag formuleert dat spanningsveld: hoe kan een lokaal gehost Large Language Model veilig en beheersbaar worden geïntegreerd in Visual Studio 2022 binnen een gesloten Defensieomgeving? Het woord "veilig" gaat over de beveiligingskaders. Het woord "beheersbaar" gaat over de controle die ontwikkelaars en beheerders moeten houden over wat het model doet.*

**Overgang:**
> *Om die vraag systematisch te beantwoorden heb ik hem opgesplitst in vijf deelvragen.*

---

## Scène 2 — Deelvragen & omvang van het onderzoek

**Spreekdoel:** de commissie ziet dat het onderzoek methodisch opgedeeld is en kent de omvang in cijfers.

**Wat de commissie ziet:** het "Onderzoek in één oogopslag"-blok met de vijf deelvraagkaartjes en KPI-tegels.

**Spreektekst:**
> *De vijf deelvragen volgen de logische opbouw van een ontwerpgericht onderzoek. DV1 inventariseert de beveiligings- en architectuureisen, vooral via documentanalyse van BIO, de D/300-serie, het DBB en de OWASP LLM Top 10. DV2 verzamelt functionele en niet-functionele requirements via stakeholderinterviews. DV3 doet een vergelijkende analyse van bestaande LLM-integraties om ontwerpprincipes te onderbouwen. DV4 ontwerpt de communicatie tussen IDE en LLM, inclusief trust boundaries. En DV5 evalueert de MVP — zowel statisch als empirisch via een gebruikersacceptatietest met de doelgroep. Rechts zien jullie de omvang van het onderzoek in cijfers: negen ontwerpcriteria, vijftien requirements en vierhonderdnegenennegentig MSTest-cases. Dat zijn de meetpunten waarop ik bij de evaluatie steeds terugkom.*

**Overgang:**
> *De onderbouwing van die deelvragen begint bij het theoretisch kader.*

---

## Scène 3 — Theoretisch kader: drie domeinen en hun spanningsvelden

**Spreekdoel:** de commissie begrijpt dat het probleem op het snijvlak van drie literatuurdomeinen ligt, en dat de overlap daartussen de meest interessante inzichten oplevert.

**Wat de commissie ziet:** Venn-diagram met de drie cirkels — modelgedrag, beveiliging, IDE-integratie.

**Spreektekst:**
> *Ik heb het theoretisch kader bewust opgezet rond drie domeinen die voor dit probleem allemaal even relevant zijn. Het eerste is modelgedrag en outputkwaliteit, met literatuur zoals Brown over GPT-3 en Chen over Codex — die laten zien dat LLM-output statistisch is, dus niet vanzelfsprekend correct. Het tweede is beveiliging, met Shostack over threat modeling en de OWASP LLM Top 10. Het derde is integratie en interactie in de IDE, met Amershi's richtlijnen voor mens-AI-interactie en de Microsoft Visual Studio extensibility-documentatie. Wat interessant is, is niet wat ieder domein op zich zegt, maar de overlap. Daar waar beveiliging en modelgedrag elkaar raken, ontstaat bijvoorbeeld het inzicht dat context-selectie tegelijk een kwaliteitskwestie én een privacy-kwestie is. Dat soort spanningsvelden vormen de basis voor mijn ontwerpcriteria.*

**Overgang:**
> *Hoe ik van die literatuur naar concrete criteria ben gekomen, laat het volgende beeld zien.*

---

## Scène 4 — Synthese: van literatuur naar ontwerpcriterium

**Spreekdoel:** de commissie begrijpt dat elk ontwerpcriterium herleidbaar is naar een specifiek synthese-inzicht en die op zijn beurt naar specifieke literatuur. De methodische traceability is hiermee aangetoond.

**Wat de commissie ziet:** Sankey-conceptmap die loopt van literatuur via theoretische clusters en synthese-inzichten naar de negen OC's.

**Spreektekst:**
> *Dit diagram laat de methodische herleidbaarheid zien. Links staat de literatuur. Die heb ik gegroepeerd in vijf theoretische clusters: LLM-theorie, productiviteit, mens-AI-interactie, security, en IDE-architectuur. Uit die clusters heb ik vervolgens acht synthese-inzichten gedestilleerd — zoals "human-in-the-loop", "contextbegrenzing" of "procesisolatie". Elk inzicht is uiteindelijk vertaald naar één of meer ontwerpcriteria, helemaal rechts. Wat ik hier wil benadrukken: geen enkel ontwerpcriterium komt uit de lucht vallen. Voor elk OC kan ik teruglopen langs deze paden naar de literatuur waar het op gebaseerd is. Dat is precies wat traceability betekent in een ontwerpgericht onderzoek.*

**Overgang:**
> *Die negen ontwerpcriteria vormen het toetsbare kader voor de rest van het onderzoek.*

---

## Scène 5 — Ontwerpcriteria overkoepelend

**Spreekdoel:** de commissie ziet de negen OC's in samenhang en begrijpt dat ze allemaal vanuit de deelvragen zijn afgeleid.

**Wat de commissie ziet:** traceability graph met de preset *DV → OC* — alleen deelvragen en ontwerpcriteria, met de afleidingspijlen tussen beide.

**Spreektekst:**
> *Hier zie je in één beeld welke deelvraag welk ontwerpcriterium heeft opgeleverd. DV1 — de beveiligingsanalyse — heeft OC-4, OC-5 en OC-6 voortgebracht: volledig offline werken, geen persistente opslag van gevoelige data, en gescheiden verantwoordelijkheden. DV3 — de vergelijkende analyse — leverde de criteria rond contextbeperking en beheersing van modelstochasticiteit. DV4 — het architectuurontwerp — onderbouwt de criteria voor ondersteunde extensiemechanismen en foutbestendige communicatie. DV5, de evaluatie zelf, voedt de criteria rond human-in-the-loop en transparantie. Geen enkel criterium hangt los. En geen enkele deelvraag is "vrijblijvend"; ze hebben allemaal een aantoonbare uitkomst.*

**Overgang:**
> *Om te laten zien hoe één zo'n criterium volledig wordt uitgewerkt, gebruik ik OC-4 als voorbeeld.*

---

## Scène 6 — Bewijs-keten OC-2 (Contextbeperking)

**Spreekdoel:** de commissie ziet één complete bewijs-keten van begin tot eind, en begrijpt dat dezelfde structuur voor elk van de negen criteria beschikbaar is.

**Wat de commissie ziet:** OC Explorer met OC-2 actief — vijf genummerde secties van herkomst, requirements, normen, implementatie en validatie.

**Spreektekst:**
> *OC-2 luidt: "contextdeling met het LLM vindt uitsluitend plaats via expliciete keuze van de ontwikkelaar." Ik gebruik dit criterium als voorbeeld omdat het precies het spanningsveld tussen veiligheid en effectiviteit raakt dat centraal staat in dit onderzoek. In de eerste sectie zie je waar het vandaan komt: DV2 leverde dit op — stakeholders benoemden al vroeg het risico dat ontwikkelaars onbedoeld gevoelige code naar een model sturen. De theoretische basis is Grounded generation en het BIO 10.1 need-to-know principe. In sectie twee zie je hoe ik het heb vertaald naar concrete eisen: FR-4 voor contextgebonden interactie, FR-7 voor inzicht in verzonden informatie, en FR-8 voor configuratie van het contextgebruik. Sectie drie verankert het in normen: BIO 10.1. Sectie vier wijst aan waar het in de code zit: de ContextMode-enum in ContextProvider met vier niveaus — Off, SelectionOnly, IncludeMethod en IncludeFile. SelectionOnly is de standaard: alleen wat de ontwikkelaar expliciet heeft geselecteerd. Methode- en bestandscontext vereisen expliciet opt-in. Een 500-regelcap begrenst de maximale payload. Sectie vijf toont de validatie: 26 testcases in ContextSelectionTests en InMemoryContextSettingsTests valideren factory-isolatie, mode-roundtrip en ceiling-logica. En tot slot: dit criterium mitigeert risico R8 — onbedoelde verwerking van gevoelige informatie — samen met OC-4 en OC-5. Dit is de bewijs-keten die ik voor elk van de negen OC's kan tonen.*

**Overgang:**
> *Hoe die criteria zich vertalen naar concrete requirements, laat het volgende beeld zien.*

---

## Scène 7 — Requirements: OC vertaald naar functionele eisen

**Spreekdoel:** de commissie begrijpt dat ontwerpcriteria niet alleen abstract zijn maar resulteren in concrete, geprioriteerde eisen, en dat de MUST-eisen volledig in de MVP zitten.

**Wat de commissie ziet:** traceability graph met de preset *MUST coverage* — alle OC's met hun MUST-prioriteit FR's, NFR's en constraints.

**Spreektekst:**
> *Wat je hier ziet is welke ontwerpcriteria zich vertaald hebben in MUST-eisen. Voor de MVP-scope heb ik bewust gekozen om alle MUST-eisen volledig te realiseren en SHOULD- en COULD-eisen op basis van toegevoegde waarde af te wegen. In totaal zijn er acht functionele requirements, vijf niet-functionele en twee constraints. NFR-2 — de output-responstijd — is empirisch getoetst in twee omgevingen. In de productieomgeving binnen het LITON haalt de extensie de eis van p95 onder vijf seconden met een gemeten p95 van 4,27 seconden. Op lokale ontwikkelhardware met een zwaarder model wordt de eis niet gehaald — dat is een hardware- en modelafhankelijkheid, geen softwareprobleem. Die nuance staat ook expliciet in de matrix.*

**Overgang:**
> *De volgende stap is hoe die eisen daadwerkelijk zijn gerealiseerd in code.*

---

## Scène 8 — Architectuur & MVP: realisatie

**Spreekdoel:** de commissie begrijpt dat de architectuur zo is opgezet dat elk ontwerpcriterium herleidbaar is naar een concrete module, en dat de trust boundaries expliciet zijn.

**Wat de commissie ziet:** traceability graph met de preset *OC → MVP* — alle ontwerpcriteria met de MVP-modules waarin ze gerealiseerd zijn.

**Spreektekst:**
> *De MVP is een Visual Studio-extensie die communiceert met een lokale of intern gehoste LLM-runtime. De kernmodules dragen de negen ontwerpcriteria. AppDefaults centraliseert alle constants — modelparameters, URL's en timeouts — zodat OC-3 over modelstochasticiteit getest kan worden via pinning-tests. OpenAICompatibleClient en OpenWebUIClient zijn de twee implementaties van het backend-agnostisch clientcontract ILlmClient. Zij zijn de enige uitgaande netwerkactoren in de hele oplossing. PromptOrchestrator beheert de chathistorie in-memory, zonder ooit naar schijf te schrijven. ContextProvider implementeert de context-ceiling — een vier-niveau beperking van wat het LLM mag zien, met SelectionOnly als veilige default. In versie 0.4 zijn daar streaming-responses via SSE en reasoning-ondersteuning met een inklapbaar denkblok aan toegevoegd. De Core-bibliotheek heeft expliciet geen Visual Studio SDK-references, om de trust boundary tussen Core en VSIX-host hard te maken. Wat ik wil benadrukken: deze architectuur is bewust ontworpen om aantoonbaar te zijn. Voor elke regel code die ertoe doet kan ik terugverwijzen naar het ontwerpcriterium waar hij vandaan komt.*

**Overgang:**
> *En dan komt de evaluatie: hebben we ook bewezen dat het werkt?*

---

## Scène 9 — Evaluatie & Validatie: systematische validatie van de MVP

**Spreekdoel:** de commissie ziet dat de MVP niet alleen gebouwd maar ook systematisch gevalideerd is — via code coverage, mutatietests, OC-matrix, STRIDE en een afgeronde gebruikersacceptatietest.

**Wat de commissie ziet:** de Evaluatie & Validatie-pagina, tabblad *Technische validatie* — coveragekaarten, progressbars, OC-validatiematrix en STRIDE-tabel.

**Spreektekst:**
> *De evaluatie loopt langs vijf dimensies. De eerste is de OC-naleving: alle negen ontwerpcriteria zijn in de v0.4-codebase aantoonbaar geïmplementeerd — negen keer "Ja" in de evaluatiematrix. De tweede dimensie is de code coverage: 499 testcases over 32 testklassen — 29 unit- en 3 integratieklassen. Het project-totaal staat op 62,7% lijn-dekking. Maar dat getal vraagt uitleg. De Coverlet-engine meetelt ook de WPF View-laag — XAML-controls die architectureel buiten de unit-testscope vallen. De kernscope, de unit-testbare services, viewmodels en DTO's, haalt 93,9% lijn-dekking en 85% branch-dekking. Aanvullend zijn acht mutatietests uitgevoerd op de kritiekste ontwerp-invarianten; alle acht mutanten zijn gevangen. De derde dimensie is de STRIDE-analyse: alle zes bedreigingscategorieën zijn beoordeeld; het hoogste restrisico is "Gedeeltelijk" bij Repudiation — bewust geaccepteerd omdat promptinhoud niet wordt gelogd. De vierde is het risicoregister. En de vijfde dimensie — de praktijkevaluatie — is afgerond; dat is het volgende tabblad.*

**Overgang:**
> *De technische validatie toont negen OC's voldaan. De praktijkevaluatie laat zien wat de doelgroep ervan vindt.*

---

## Scène 10 — Praktijkevaluatie: gebruikersacceptatietest

**Spreekdoel:** de commissie begrijpt dat de praktijkvalidatie is afgerond, kent de belangrijkste uitkomsten en ziet dat de resultaten de ontwerpkeuzes ondersteunen.

**Wat de commissie ziet:** de Evaluatie & Validatie-pagina, tabblad *Praktijkevaluatie (GAT)* — live data uit Google Forms met Likert-scores, open feedback, eindcijfer en aanbevelingsscore.

**Spreektekst:**
> *De gebruikersacceptatietest is uitgevoerd met vijf ontwikkelaars van JIVC SO&I die de extensie gedurende twee weken in vrij gebruik hebben genomen. Na die periode hebben ze een gestructureerde vragenlijst ingevuld. Het resultaat is een gemiddeld eindcijfer van 7,4 op 10 en een aanbevelingsscore van 8,2 op 10. Het sterkste signaal is de human-in-the-loop-aanpak: die scoort 4,8 op 5. Gebruikers vinden het veilig en beheersbaar dat AI-output een voorstel blijft. Ook de bereidheid om de extensie opnieuw te gebruiken bij doorontwikkeling scoort 4,8 op 5. De potentie binnen Defensie scoort 4,4. Het zwakste punt is het inzicht in welke informatie naar het model wordt verzonden — een 3,2 op 5. Dat nuanceert OC-9: de MVP toont contextinformatie, maar gebruikers begrijpen niet altijd goed welke context bij welke vraag hoort. Dat is een concreet verbeterpunt. Wat de NFR-2 responstijd betreft: in de productieomgeving op het LITON haalt de extensie een p95 van 4,27 seconden — onder de eis van vijf seconden. De feedback-latentie is verwaarloosbaar: onder de drie milliseconden in alle metingen. En versie 0.4 voegt streaming toe, waardoor de subjectief ervaren wachttijd nog verder daalt.*

**Overgang:**
> *De heatmap laat in één oogopslag zien welke OC's het zwaarst onderbouwd zijn vanuit de deelvragen.*

---

## Scène 11 — Evaluatie: OC × DV-dekking in één oogopslag

**Spreekdoel:** de commissie ziet visueel dat elke OC empirisch is gedekt vanuit ten minste één deelvraag, en welke OC's het zwaarst onderbouwd zijn.

**Wat de commissie ziet:** OC × DV coverage heatmap — vijf rijen (DV1-5) maal negen kolommen (OC-1 t/m OC-9), gekleurd naar het aantal afleidingspaden.

**Spreektekst:**
> *Deze heatmap is een soort dekkingscontrole. Elke rij is een deelvraag, elke kolom een ontwerpcriterium. Hoe donkerder de cel, hoe meer paden er lopen tussen die deelvraag en dat criterium. Geen enkele OC heeft een lege kolom — alles is herleidbaar. De zwaarst gedekte criteria, OC-2 over contextbegrenzing en OC-4 over offline verwerking, zijn niet toevallig de criteria die de kern van het probleem raken: omgaan met gevoelige context binnen een gesloten omgeving. Lege cellen zijn overigens niet "gaten" — een OC kan ook via normen of via een ander pad onderbouwd zijn. Voor het volledige plaatje gebruik ik de traceability graph daarnaast.*

**Overgang:**
> *Maar evaluatie van OC's is één ding; risico's beheersen is een ander.*

---

## Scène 12 — Validatie: risico's afgedekt door ontwerpcriteria

**Spreekdoel:** de commissie begrijpt dat het onderzoek systematisch geïdentificeerde risico's heeft afgedekt via ontwerpkeuzes, en dat de paar openstaande risico's bewust en gemotiveerd open blijven.

**Wat de commissie ziet:** traceability graph met de preset *OC mitigeert risico* — alle ontwerpcriteria met de risico's die ze afdekken, via rode mitigates-edges.

**Spreektekst:**
> *In het risicoregister staan negen risico's. Vijf daarvan zijn aantoonbaar gemitigeerd door ontwerpkeuzes die in de MVP zitten. R3 — het risico dat OC's niet toetsbaar zouden zijn — is gemitigeerd door de pinning-tests in AppDefaults. R4 — beperkingen vanuit de Visual Studio SDK — is gemitigeerd door alleen ondersteunde mechanismen te gebruiken. R7 — het risico dat ontwikkelaars AI-output onkritisch overnemen — is gemitigeerd door OC-1: output wordt nooit automatisch toegepast en de gebruiker moet handmatig kopiëren of Apply bevestigen. De GAT bevestigt dit: human-in-the-loop scoort 4,8 op 5. R8, het risico op onbedoelde verwerking van gevoelige info, is gemitigeerd door drie OC's tegelijk: contextbegrenzing, CreateBaseUri-validatie en geen persistente opslag. Eén risico is bewust open gehouden: R6 over hardware-performance. De NFR-2 meting bevestigt dat: lokaal met een 13B-model wordt de eis niet gehaald, maar in de productieomgeving op het LITON wel. Dat is een infrastructuurkeuze, geen softwaredefect.*

**Overgang:**
> *De volgende vraag is: hoe heeft de MVP zich ontwikkeld, en waar gaat het heen?*

---

## Scène 13 — Ontwikkelroadmap: van onderzoek naar overdracht

**Spreekdoel:** de commissie ziet dat de MVP niet in één keer is gebouwd maar via een bewust iteratief groeimodel, en dat elke versie een andere validatievraag beantwoordt.

**Wat de commissie ziet:** de roadmap-pagina met de drie fasebanden (Verkenning, Validatie, Verfijning & Overdracht), de versiekaarten v0.1 t/m v1.0, en de scope-grens die de onderzoeksafbakening markeert.

**Spreektekst:**
> *De roadmap laat zien hoe de MVP zich heeft ontwikkeld van een eerste conceptarchitectuur naar de huidige versie 0.4. Elke versie beantwoordt een andere vraag. Versie 0.1 toonde aan dat de communicatie tussen Visual Studio en Ollama technisch haalbaar is. Versie 0.2 introduceerde de ontwerpcriteria als testbaar kader: ContextMode, AppDefaults en de eerste 138 tests. Versie 0.3 breidde de testsuite uit naar 247 cases en voegde het backend-agnostisch clientcontract toe — ILlmClient met OpenAICompatibleClient en OpenWebUIClient. Versie 0.4, de huidige release, voegt streaming-responses via SSE toe, reasoning-ondersteuning met een inklapbaar denkblok, en een gesplitste systeemprompt. De testsuite staat nu op 499 cases over 32 klassen. De stippellijn markeert de scope-grens: alles links daarvan is onderdeel van dit afstudeeronderzoek; de versies rechts — 0.5 en 1.0 — zijn aanbevelingen voor doorontwikkeling na overdracht.*

**Overgang:**
> *En die versies staan niet los van de onderzoeksmethode.*

---

## Scène 14 — Koppeling onderzoeksmethodiek: iteratief groeimodel

**Spreekdoel:** de commissie begrijpt dat de versie-indeling aansluit bij de fasen van het ontwerpgericht onderzoek volgens de design cycle van Wieringa.

**Wat de commissie ziet:** de methodologiesectie onder de roadmap met de koppeling versie → onderzoeksfase → validatievraag.

**Spreektekst:**
> *Dit deel maakt de relatie tussen versies en onderzoeksfasen expliciet. De drie fasebanden — verkenning, validatie, en verfijning & overdracht — corresponderen met de stappen uit de design cycle van Wieringa. Versie 0.1 en 0.2 vallen in de verkenningsfase: kan het technisch, en is het toetsbaar? Versie 0.3 en 0.4 vallen in de validatiefase: voldoet het aan de eisen, en werkt het in de praktijk? De statische evaluatie, de gebruikersacceptatietest en de NFR-2 metingen zijn hier uitgevoerd. Versies 0.5 en 1.0 vallen buiten de onderzoeksscope, maar de aanbevelingen uit DV5 geven concrete richting: betere contexttransparantie, TTFT-metingen voor streaming, en Apply-robuustheid over VS-versies.*

**Overgang:**
> *Dat brengt mij bij de conclusie.*

---

## Scène 15 — Conclusie: resultaat in cijfers

**Spreekdoel:** de commissie houdt drie cijfers en één boodschap over: het kader is compleet, de MVP realiseert het, de praktijkvalidatie bevestigt het, en alles is herleidbaar.

**Wat de commissie ziet:** landingspagina met de KPI-tegels — 9 OC, 15 requirements, 499 MSTest-cases, link naar de graph.

**Spreektekst:**
> *Drie cijfers vatten het resultaat samen. Negen ontwerpcriteria die het toetsbare kader vormen — alle negen voldaan. Vijftien requirements waarin die criteria geoperationaliseerd zijn. Vierhonderdnegenennegentig MSTest-cases die bewijzen dat de implementatie aan haar verplichtingen voldoet — met 93,9% lijn-dekking op de kernscope en acht op acht mutanten gevangen. De praktijkvalidatie met vijf ontwikkelaars uit de doelgroep bevestigt het beeld: een eindcijfer van 7,4, een aanbevelingsscore van 8,2 en de uitspraak dat human-in-the-loop veilig en beheersbaar voelt. NFR-2 is in de productieomgeving gehaald. De deelvraag van DV5 is daarmee beantwoord: de MVP voldoet binnen de afgebakende scope aan de belangrijkste eisen voor informatiebeveiliging en beheersbaarheid, en is in de praktijk voldoende bruikbaar en effectief voor ondersteunende ontwikkeltaken. De centrale onderzoeksvraag is beantwoord — niet alleen met een werkend prototype, maar met een ontwerpkennis-keten die opdrachtgever en commissie kunnen verifiëren. Dat is wat traceability in dit onderzoek concreet betekent.*

**Afsluiting:**
> *Dat was de geleide tour. De rest van het portfolio — de tabellen, de uitvoeringsdiagrammen, het Plan van Aanpak, de roadmap — is beschikbaar om door te klikken bij vragen. Ik ben benieuwd naar jullie vragen.*

---

## Snelle verwijzingen tijdens vraag-en-antwoord

Mocht de commissie tijdens de Q&A een specifiek onderdeel willen zien:

| Vraag | Open in portfolio |
|---|---|
| "Laat OC-X zien" | OC Explorer, kies in linker rail of typ `?id=OC-X` in URL |
| "Waar in de code zit dit?" | OC Explorer sectie 4 ("Implementatie") |
| "Welke literatuur ondersteunt dit?" | OC Explorer sectie 1 ("Herkomst") — DOI-links openen direct |
| "Welk testresultaat staat hier achter?" | OC Explorer sectie 5 ("Validatie") |
| "Welk risico mitigeert dit?" | Traceability graph, preset *OC mitigeert risico* |
| "Hoe vergelijken de OC's zich tegen elkaar?" | Traceability heatmap |
| "Hoe is DV-X uitgevoerd?" | Klik DV-X in het uitvoeringsdiagram, of `?focus=DV-X` in graph URL |
| "Welke norm wordt hier geraakt?" | Tabblad **Normen** in de traceability matrix |
| "Wat is de code coverage?" | Evaluatie & Validatie → Technische validatie → coverage cards |
| "Hoe is STRIDE uitgevoerd?" | Evaluatie & Validatie → STRIDE-analyse sectie |
| "Wat zeggen de gebruikers?" | Evaluatie & Validatie → Praktijkevaluatie (GAT) tabblad |
| "NFR-2 responstijd?" | Evaluatie & Validatie → GAT → NFR-2 meetresultaten |
| "Hoe is de MVP gegroeid?" | Roadmap-pagina → versiekaarten en fasebanden |
| "Welke aanbevelingen voor doorontwikkeling?" | Roadmap → v0.5/v1.0 kaarten of DV5 §5.8.3 |

---

## Bijlage — checklist vóór de presentatie

- [ ] Portfolio in fullscreen openen
- [ ] Klik op `🎓 Tour` om de overlay actief te maken
- [ ] Test eenmaal `→` en `←` om te bevestigen dat de toetsen werken
- [ ] Druk `P` om presentatie-modus te activeren (verbergt nav en footer)
- [ ] Controleer dat de Live Server URL bereikbaar is voor de commissie
- [ ] Houd dit script open op een tweede scherm of geprint naast je
- [ ] Adem rustig — de tour drijft het ritme, niet jij

---

## Bijlage — kerngetallen voor de Q&A

| Metriek | Waarde |
|---|---|
| MVP-versie | v0.4 |
| Ontwerpcriteria | 9 (alle voldaan) |
| Requirements | 15 (8 FR, 5 NFR, 2 C) |
| MSTest-cases | 499 over 32 klassen (29 unit + 3 integratie) |
| Project lijn-dekking | 62,7% |
| Core-scope lijn-dekking | 93,9% |
| Core-scope branch-dekking | 85% |
| Mutatietests | 8/8 gevangen |
| STRIDE hoogste restrisico | Gedeeltelijk (Repudiation) |
| GAT respondenten | 5 ontwikkelaars JIVC SO&I |
| Eindcijfer | 7,4 / 10 |
| Aanbevelingsscore | 8,2 / 10 |
| Human-in-the-loop score | 4,8 / 5 |
| NFR-2 p95 productie | 4,27 s (eis: ≤ 5 s) |
| NFR-2 T_feedback | < 3 ms |
| Tour-scènes | 15 |
