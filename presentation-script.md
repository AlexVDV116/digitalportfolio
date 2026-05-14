# Presentatiescript — Verdediging Afstudeeronderzoek

**Onderwerp:** Veilige en beheersbare integratie van een lokaal gehost Large Language Model in Visual Studio 2022 binnen een gesloten Defensieomgeving.

Dit script begeleidt de **🎓 Tour** in het digitale portfolio. Twaalf scènes, ongeveer vijf tot zes minuten spreektijd, voor de inleiding van de verdediging. Per scène staat:

- **Spreekdoel** — wat de commissie na deze scène moet begrijpen
- **Wat de commissie ziet** — wat op het scherm staat
- **Spreektekst** — wat ik mondeling vertel (natuurlijke toon, niet voorlezen)
- **Overgang** — de zin waarmee ik doorloop naar de volgende scène

De rode draad door alle scènes is dezelfde keten die het portfolio centraal stelt: **theorie → ontwerpcriteria → requirements → ontwerpbeslissingen → code/MVP → tests en evaluatie → conclusie**. Bij elke stap maak ik traceability expliciet.

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
> *De vijf deelvragen volgen de logische opbouw van een ontwerpgericht onderzoek. DV1 inventariseert de beveiligings- en architectuureisen, vooral via documentanalyse van BIO, de D/300-serie, het DBB en de OWASP LLM Top 10. DV2 verzamelt functionele en niet-functionele requirements via stakeholderinterviews. DV3 doet een vergelijkende analyse van bestaande LLM-integraties om ontwerpprincipes te onderbouwen. DV4 ontwerpt de communicatie tussen IDE en LLM, inclusief trust boundaries. En DV5 evalueert de MVP. Rechts zien jullie de omvang van het onderzoek in cijfers: negen ontwerpcriteria, vijftien requirements en tweehonderdzevenenveertig MSTest-cases. Dat zijn de meetpunten waarop ik bij de evaluatie steeds terugkom.*

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

## Scène 6 — Bewijs-keten OC-4 (Volledig offline)

**Spreekdoel:** de commissie ziet één complete bewijs-keten van begin tot eind, en begrijpt dat dezelfde structuur voor elk van de negen criteria beschikbaar is.

**Wat de commissie ziet:** OC Explorer met OC-4 actief — vijf genummerde secties van herkomst, requirements, normen, implementatie en validatie.

**Spreektekst:**
> *OC-4 luidt: "alle LLM-verwerking gebeurt volledig offline." Ik gebruik dit criterium als voorbeeld omdat het de kern van de Defensiecontext raakt. In de eerste sectie zie je waar het vandaan komt: DV1 leverde dit op, met als theoretische basis Shostack over zero-trust en OWASP LLM06 over information disclosure. In sectie twee zie je hoe ik het heb vertaald naar concrete eisen: de twee harde constraints C-1 en C-2 en de niet-functionele eis NFR-1 voor stabiliteit. Sectie drie verankert het in normen: D/304 en BIO 13.1 voor netwerkscheiding. Sectie vier wijst aan waar het in de code zit: in LlmClientBase, in de IsValidHttpUrl-check die URL-syntaxvalidatie afdwingt. OC-4 is in v0.3 een gedeelde verantwoordelijkheid: de client valideert de URL-syntax, de netwerklaag dwingt endpoint-allow-listing af via JIVC SO&I-LAN-segmentatie. Sectie vijf toont de validatie: 47 URL-validatietestcases in OllamaClientTests, OllamaClientArgumentTests en OpenWebUIClientTests dekken alle varianten. En tot slot: dit criterium mitigeert risico R8 uit het risicoregister. Dit is de bewijs-keten die ik voor elk van de negen OC's kan tonen.*

**Overgang:**
> *Hoe die criteria zich vertalen naar concrete requirements, laat het volgende beeld zien.*

---

## Scène 7 — Requirements: OC vertaald naar functionele eisen

**Spreekdoel:** de commissie begrijpt dat ontwerpcriteria niet alleen abstract zijn maar resulteren in concrete, geprioriteerde eisen, en dat de MUST-eisen volledig in de MVP zitten.

**Wat de commissie ziet:** traceability graph met de preset *MUST coverage* — alle OC's met hun MUST-prioriteit FR's, NFR's en constraints.

**Spreektekst:**
> *Wat je hier ziet is welke ontwerpcriteria zich vertaald hebben in MUST-eisen. Voor de MVP-scope heb ik bewust gekozen om alle MUST-eisen volledig te realiseren en SHOULD- en COULD-eisen op basis van toegevoegde waarde af te wegen. In totaal zijn er acht functionele requirements, vijf niet-functionele en twee constraints. Eén niet-functionele eis — NFR-2, de output-responstijd — is op het moment van schrijven nog deels open: de feedback onder de seconde is gerealiseerd, maar de inhoudelijke responstijd is hardware-afhankelijk en wordt in DV5-D5 empirisch gemeten op representatieve hardware. Dat staat ook expliciet als gedeeltelijk in de matrix; ik verberg het niet.*

**Overgang:**
> *De volgende stap is hoe die eisen daadwerkelijk zijn gerealiseerd in code.*

---

## Scène 8 — Architectuur & MVP: realisatie

**Spreekdoel:** de commissie begrijpt dat de architectuur zo is opgezet dat elk ontwerpcriterium herleidbaar is naar een concrete module, en dat de trust boundaries expliciet zijn.

**Wat de commissie ziet:** traceability graph met de preset *OC → MVP* — alle ontwerpcriteria met de MVP-modules waarin ze gerealiseerd zijn.

**Spreektekst:**
> *De MVP is een Visual Studio-extensie die communiceert met Ollama als lokale LLM-runtime. Zeven kernmodules dragen de negen ontwerpcriteria. AppDefaults centraliseert alle constants — modelparameters, URL's en timeouts — zodat OC-3 over modelstochasticiteit getest kan worden via pinning-tests. OllamaClient is de enige uitgaande netwerkactor in de hele oplossing; het is het enige module waar HTTP-verkeer vandaan komt. PromptOrchestrator beheert de chathistorie in-memory, zonder ooit naar schijf te schrijven. ContextProvider implementeert de context-ceiling — een vier-niveau beperking van wat het LLM mag zien, met SelectionOnly als veilige default. De Core-bibliotheek heeft expliciet geen Visual Studio SDK-references, om de trust boundary tussen Core en VSIX-host hard te maken. Wat ik wil benadrukken: deze architectuur is bewust ontworpen om aantoonbaar te zijn. Voor elke regel code die ertoe doet kan ik terugverwijzen naar het ontwerpcriterium waar hij vandaan komt.*

**Overgang:**
> *En dan komt de evaluatie: hebben we ook bewezen dat het werkt?*

---

## Scène 9 — Evaluatie & Validatie: systematische validatie van de MVP

**Spreekdoel:** de commissie ziet dat de MVP niet alleen gebouwd maar ook systematisch gevalideerd is — via code coverage, OC-matrix, STRIDE en een geplande gebruikersacceptatietest.

**Wat de commissie ziet:** de Evaluatie & Validatie-pagina, tabblad *Technische validatie* — coveragekaarten, progressbars, OC-validatiematrix en STRIDE-tabel.

**Spreektekst:**
> *De evaluatie loopt langs vijf dimensies. De eerste is de OC-naleving: alle negen ontwerpcriteria zijn in de v0.3-codebase aantoonbaar geïmplementeerd — negen keer "Ja" in de evaluatiematrix. De tweede dimensie is de code coverage: 247 testcases over 20 testklassen. Het project-totaal staat op 38,91% lijn-dekking, maar dat getal vraagt uitleg. De VS2022 Code Coverage engine meetelt ook de View-laag — WPF-controls die architectureel buiten de unit-testscope vallen. De kernscope, de unit-testbare services en viewmodels, haalt circa 74% lijn-dekking. De drie testklassen voor OllamaClient, OllamaClientArguments en OpenWebUIClient staan op 100%. De derde dimensie is de STRIDE-analyse: alle zes bedreigingscategorieën zijn beoordeeld; het hoogste restrisico is "Matig" bij Repudiation — bewust geaccepteerd omdat promptinhoud niet wordt gelogd. De vierde is de risicoregister: R3, R4, R7, R8 en R9 zijn gemitigeerd door de ontwerpkeuzes. R6 over hardware-performance staat bewust open. De vijfde dimensie — de praktijkevaluatie met de gebruikersacceptatietest — is gepland; dat is het tweede tabblad op deze pagina.*

**Overgang:**
> *De heatmap laat in één oogopslag zien welke OC's het zwaarst onderbouwd zijn vanuit de deelvragen.*

---

## Scène 10 — Evaluatie: dekking in één oogopslag

**Spreekdoel:** de commissie ziet visueel dat elke OC empirisch is gedekt vanuit ten minste één deelvraag, en welke OC's het zwaarst onderbouwd zijn.

**Wat de commissie ziet:** OC × DV coverage heatmap — vijf rijen (DV1-5) maal negen kolommen (OC-1 t/m OC-9), gekleurd naar het aantal afleidingspaden.

**Spreektekst:**
> *Deze heatmap is een soort dekkingscontrole. Elke rij is een deelvraag, elke kolom een ontwerpcriterium. Hoe donkerder de cel, hoe meer paden er lopen tussen die deelvraag en dat criterium. Geen enkele OC heeft een lege kolom — alles is herleidbaar. De zwaarst gedekte criteria, OC-2 over contextbegrenzing en OC-4 over offline verwerking, zijn niet toevallig de criteria die de kern van het probleem raken: omgaan met gevoelige context binnen een gesloten omgeving. Lege cellen zijn overigens niet "gaten" — een OC kan ook via normen of via een ander pad onderbouwd zijn. Voor het volledige plaatje gebruik ik de traceability graph daarnaast.*

**Overgang:**
> *Maar evaluatie van OC's is één ding; risico's beheersen is een ander.*

---

## Scène 11 — Validatie: risico's afgedekt door ontwerpcriteria

**Spreekdoel:** de commissie begrijpt dat het onderzoek systematisch geïdentificeerde risico's heeft afgedekt via ontwerpkeuzes, en dat de paar openstaande risico's bewust en gemotiveerd open blijven.

**Wat de commissie ziet:** traceability graph met de preset *OC mitigeert risico* — alle ontwerpcriteria met de risico's die ze afdekken, via rode mitigates-edges.

**Spreektekst:**
> *In het risicoregister staan negen risico's. Vijf daarvan zijn aantoonbaar gemitigeerd door ontwerpkeuzes die in de MVP zitten. R3 — het risico dat OC's niet toetsbaar zouden zijn — is gemitigeerd door de pinning-tests in AppDefaults. R4 — beperkingen vanuit de Visual Studio SDK — is gemitigeerd door alleen ondersteunde mechanismen te gebruiken. R7 — het risico dat ontwikkelaars AI-output onkritisch overnemen — is gemitigeerd door OC-1: de banner "AI-generated, human review required" en het ontbreken van auto-apply. R8, het risico op onbedoelde verwerking van gevoelige info, is gemitigeerd door drie OC's tegelijk: contextbegrenzing, IsLocalhost en geen persistente opslag. Eén risico is bewust open gehouden: R6 over hardware-performance kan ik niet in code oplossen; dat vraagt een meting op de doelhardware en die meting is gepland in DV5. Ik verberg dat niet — het staat expliciet als open in de matrix.*

**Overgang:**
> *Dat brengt mij bij de conclusie.*

---

## Scène 12 — Conclusie: resultaat in cijfers

**Spreekdoel:** de commissie houdt drie cijfers en één boodschap over: het kader is compleet, de MVP realiseert het, en alles is herleidbaar.

**Wat de commissie ziet:** landingspagina met de KPI-tegels — 9 OC, 15 requirements, 247 MSTest-cases, link naar de graph.

**Spreektekst:**
> *Drie cijfers vatten het resultaat samen. Negen ontwerpcriteria die het toetsbare kader vormen. Vijftien requirements waarin die criteria geoperationaliseerd zijn. Tweehonderdzevenenveertig MSTest-cases die bewijzen dat de implementatie aan haar verplichtingen voldoet. Alle MUST-eisen zijn gerealiseerd. Eén niet-functionele eis is gedeeltelijk — open en transparant gerapporteerd. Maar belangrijker dan de cijfers is wat dit portfolio laat zien: dat elk van die OC's, requirements en testresultaten herleidbaar is naar een specifieke deelvraag en naar specifieke literatuur. De centrale onderzoeksvraag is daarmee beantwoord, niet alleen met een werkende prototype, maar met een ontwerpkennis-keten die opdrachtgever en commissie kunnen verifiëren. Dat is wat traceability in dit onderzoek concreet betekent.*

**Afsluiting:**
> *Dat was de geleide tour. De rest van het portfolio — de tabellen, de uitvoeringsdiagrammen, het Plan van Aanpak — is beschikbaar om door te klikken bij vragen. Ik ben benieuwd naar jullie vragen.*

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
| "Hoe staat het met de gebruikerstest?" | Evaluatie & Validatie → Praktijkevaluatie (GAT) tabblad |

---

## Bijlage — checklist vóór de presentatie

- [ ] Portfolio in fullscreen openen
- [ ] Klik op `🎓 Tour` om de overlay actief te maken
- [ ] Test eenmaal `→` en `←` om te bevestigen dat de toetsen werken
- [ ] Druk `P` om presentatie-modus te activeren (verbergt nav en footer)
- [ ] Controleer dat de Live Server URL bereikbaar is voor de commissie
- [ ] Houd dit script open op een tweede scherm of geprint naast je
- [ ] Adem rustig — de tour drijft het ritme, niet jij
