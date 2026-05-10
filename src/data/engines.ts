export type EngineId = 'gasoline-four-stroke' | 'diesel-four-stroke' | 'two-stroke'

export type IgnitionMode = 'spark' | 'compression' | 'ported'

export type CylinderContent = 'air' | 'mixture' | 'compressed' | 'burning' | 'expanded' | 'exhaust' | 'scavenge'

export type EnginePhase = {
  id: string
  name: string
  shortName: string
  start: number
  end: number
  summary: string
  detail: string
  cylinderContent: CylinderContent
  combustion: boolean
}

export type EngineSpecs = {
  bore: string
  stroke: string
  displacement: string
  compressionRatio: string
  peakPressure: string
  fuel: string
  airFuelRatio: string
  ignition: string
  cycleType: string
  invented: string
  typicalRpm: string
  typicalEfficiency: string
}

export type EngineDefinition = {
  id: EngineId
  name: string
  shortName: string
  subtitle: string
  cycleDegrees: number
  ignitionMode: IgnitionMode
  color: string
  glow: string
  summary: string
  history: string
  workingPrinciple: string
  bestFor: string[]
  tradeoffs: string[]
  phases: EnginePhase[]
  specs: EngineSpecs
  compressionRatio: number
  combustionMode: 'otto' | 'diesel' | 'mixed'
  baseEfficiency: number
  torqueBias: number
  fuelIntensity: number
  intakeValve: { open: number; close: number }
  exhaustValve: { open: number; close: number }
  sparkAdvance?: number
  injectionStart?: number
  injectionEnd?: number
  scavengePort?: { open: number; close: number }
  exhaustPort?: { open: number; close: number }
}

export const engines: EngineDefinition[] = [
  {
    id: 'gasoline-four-stroke',
    name: 'Motor pe benzina, 4 timpi',
    shortName: 'Benzina 4T',
    subtitle: 'Ciclu Otto cu aprindere prin scanteie',
    cycleDegrees: 720,
    ignitionMode: 'spark',
    color: '#fb923c',
    glow: 'rgba(251, 146, 60, 0.55)',
    summary:
      'Motorul Otto comprima un amestec aer-benzina pre-pregatit si il aprinde cu o scanteie electrica. Este elastic, urca rapid in turatie si are masa redusa pentru puterea livrata.',
    history:
      'Inventat in 1876 de Nikolaus Otto si Eugen Langen ca motor in 4 timpi. Karl Benz l-a folosit pe primul automobil in 1885. Astazi, motoarele moderne adauga injectie directa, turbocompresor si distributie variabila pentru a creste eficienta.',
    workingPrinciple:
      'Amestecul aer-benzina este pregatit in colectorul de admisie sau injectat direct in cilindru. Dupa compresia moderata (raport 9-12), bujia produce o scanteie cu cativa grade inainte de PMS. Frontul de flacara se propaga rapid prin amestec, presiunea creste aproape la volum constant si imping pistonul in jos.',
    bestFor: [
      'Autoturisme, SUV-uri si motociclete',
      'Aplicatii care cer raspuns rapid la accelerator',
      'Soferi care vor masa redusa si zgomot moderat',
    ],
    tradeoffs: [
      'Eficienta termica mai mica decat diesel-ul',
      'Consum crescut la sarcina mare si turatii inalte',
      'Cuplu mai mic la turatii joase fara turbo',
    ],
    compressionRatio: 10.5,
    combustionMode: 'otto',
    baseEfficiency: 0.32,
    torqueBias: 0.95,
    fuelIntensity: 1,
    intakeValve: { open: 700, close: 220 },
    exhaustValve: { open: 500, close: 20 },
    sparkAdvance: 350,
    specs: {
      bore: '84 mm',
      stroke: '88 mm',
      displacement: '1.99 l (4 cilindri)',
      compressionRatio: '10.5:1',
      peakPressure: '60-80 bar',
      fuel: 'Benzina (RON 95-98)',
      airFuelRatio: '14.7:1 (stoichiometric)',
      ignition: 'Bujie, scanteie controlata electronic',
      cycleType: 'Otto (combustie la volum constant)',
      invented: 'Nikolaus Otto, 1876',
      typicalRpm: '800 - 7.000 rpm',
      typicalEfficiency: '25 - 38 %',
    },
    phases: [
      {
        id: 'intake',
        name: 'Admisie',
        shortName: 'Admisie',
        start: 0,
        end: 180,
        summary: 'Pistonul coboara, supapa de admisie deschisa, cilindrul se umple cu amestec.',
        detail:
          'Pe masura ce pistonul coboara de la PMS spre PMI, volumul cilindrului creste si presiunea scade sub cea atmosferica. Supapa de admisie deschisa permite intrarea amestecului aer-combustibil pregatit. Clapeta de acceleratie controleaza cat aer poate intra, deci cat de mult amestec va arde.',
        cylinderContent: 'mixture',
        combustion: false,
      },
      {
        id: 'compression',
        name: 'Compresie',
        shortName: 'Compresie',
        start: 180,
        end: 360,
        summary: 'Pistonul urca cu supapele inchise, amestecul este comprimat de aproape 10 ori.',
        detail:
          'Cu ambele supape inchise, pistonul comprima amestecul intr-un volum mic. Presiunea creste de la 1 bar la 15-25 bar, iar temperatura urca la 400-500 °C. Compresia adiabatica urmeaza relatia P·V^1.4 = constant. Cu cativa grade inainte de PMS, modulul de aprindere comanda scanteia.',
        cylinderContent: 'compressed',
        combustion: false,
      },
      {
        id: 'power',
        name: 'Ardere si destindere',
        shortName: 'Putere',
        start: 360,
        end: 540,
        summary: 'Bujia aprinde amestecul, presiunea sare la 60-80 bar si imping pistonul in jos.',
        detail:
          'Frontul de flacara strabate camera in cateva milisecunde. Pentru ciclul Otto ideal, arderea are loc la volum constant: presiunea sare brusc, temperatura ajunge la 2000-2500 °C. Apoi gazele se destind si imping pistonul - acesta este singurul timp care produce lucru mecanic util in cele patru.',
        cylinderContent: 'burning',
        combustion: true,
      },
      {
        id: 'exhaust',
        name: 'Evacuare',
        shortName: 'Evacuare',
        start: 540,
        end: 720,
        summary: 'Supapa de evacuare se deschide, pistonul urca si scoate gazele arse.',
        detail:
          'Cand pistonul ajunge aproape de PMI, supapa de evacuare se deschide si presiunea reziduala (3-5 bar) elibereaza gazele in colector. Pe restul cursei, pistonul impinge mecanic gazele ramase. La final, supapa de admisie incepe sa se deschida inainte de inchiderea celei de evacuare - aceasta suprapunere ajuta umplerea pe motoarele de turatie inalta.',
        cylinderContent: 'exhaust',
        combustion: false,
      },
    ],
  },
  {
    id: 'diesel-four-stroke',
    name: 'Motor diesel, 4 timpi',
    shortName: 'Diesel 4T',
    subtitle: 'Ciclu diesel cu aprindere prin compresie',
    cycleDegrees: 720,
    ignitionMode: 'compression',
    color: '#22d3ee',
    glow: 'rgba(34, 211, 238, 0.55)',
    summary:
      'Motorul diesel comprima doar aer pana la peste 30 bar si 600 °C, apoi pulverizeaza motorina la presiune foarte mare. Aceasta se autoaprinde, generand cuplu masiv si eficienta termica ridicata.',
    history:
      'Patentat in 1893 de Rudolf Diesel ca motor cu randament teoretic apropiat de ciclul Carnot. Initial folosit pe nave si trenuri, a ajuns in autoturisme abia in 1936 (Mercedes-Benz 260 D). Sistemele common-rail moderne ridica presiunea de injectie la 2.000-2.500 bar.',
    workingPrinciple:
      'Aerul curat este comprimat de la 14 la peste 18 ori, ajungand la 600-900 °C. La finalul compresiei, injectorul pulverizeaza motorina la presiune extrema; aceasta se autoaprinde fara scanteie. Arderea se desfasoara mai mult la presiune constanta, ceea ce explica forma diferita a diagramei P-V.',
    bestFor: [
      'Camioane, autobuze, locomotive si nave',
      'Generatoare si utilaje cu sarcina constanta',
      'Vehicule care parcurg distante lungi',
    ],
    tradeoffs: [
      'Constructie mai grea, presiuni si vibratii mari',
      'Raspuns mai lent la accelerator decat la benzina',
      'Tratarea complexa a oxizilor de azot si a particulelor',
    ],
    compressionRatio: 18,
    combustionMode: 'diesel',
    baseEfficiency: 0.42,
    torqueBias: 1.22,
    fuelIntensity: 0.78,
    intakeValve: { open: 705, close: 230 },
    exhaustValve: { open: 490, close: 15 },
    injectionStart: 350,
    injectionEnd: 395,
    specs: {
      bore: '83 mm',
      stroke: '92 mm',
      displacement: '1.99 l (4 cilindri)',
      compressionRatio: '18.0:1',
      peakPressure: '160-200 bar',
      fuel: 'Motorina',
      airFuelRatio: '18:1 - 70:1 (variabil)',
      ignition: 'Autoaprindere prin compresie',
      cycleType: 'Diesel (combustie la presiune constanta)',
      invented: 'Rudolf Diesel, 1893',
      typicalRpm: '700 - 5.000 rpm',
      typicalEfficiency: '38 - 48 %',
    },
    phases: [
      {
        id: 'intake',
        name: 'Admisie aer curat',
        shortName: 'Admisie',
        start: 0,
        end: 180,
        summary: 'Pistonul aspira numai aer, fara combustibil amestecat in prealabil.',
        detail:
          'Spre deosebire de motorul Otto, dieselul nu pre-amesteca combustibilul. Cilindrul primeste doar aer atmosferic (sau aer comprimat de turbo). Asta permite raporturi mari de compresie fara riscul detonatiei, pentru ca nu exista combustibil care sa se autoaprinda prematur.',
        cylinderContent: 'air',
        combustion: false,
      },
      {
        id: 'compression',
        name: 'Compresie puternica',
        shortName: 'Compresie',
        start: 180,
        end: 360,
        summary: 'Aerul este comprimat de 14-22 ori, atingand 600-900 °C.',
        detail:
          'Compresia adiabatica ridica presiunea peste 30 bar si temperatura suficient pentru aprinderea spontana a motorinei. Energia mecanica investita in compresie este recuperata partial in cursa de putere. Acest pas este motivul pentru care dieselul are bloc motor mai robust si vibratii mai mari.',
        cylinderContent: 'compressed',
        combustion: false,
      },
      {
        id: 'power',
        name: 'Injectie si destindere',
        shortName: 'Putere',
        start: 360,
        end: 540,
        summary: 'Motorina este pulverizata si arde gradual, mentinand presiunea ridicata.',
        detail:
          'Common-rail-ul livreaza combustibil la 2000+ bar, in jeturi fine care se aprind aproape instant in aerul fierbinte. Pentru ciclul diesel ideal, arderea se desfasoara la presiune constanta - pistonul deja coboara in timp ce inca se injecteaza. Fata de Otto, presiunea de varf este mai mare, dar curba P-V este mai larga.',
        cylinderContent: 'burning',
        combustion: true,
      },
      {
        id: 'exhaust',
        name: 'Evacuare',
        shortName: 'Evacuare',
        start: 540,
        end: 720,
        summary: 'Gazele arse, ramase fierbinti, sunt impinse in colectorul de evacuare.',
        detail:
          'Gazele de esapament diesel contin oxigen rezidual (din raportul aer-combustibil sarac), funingine si oxizi de azot. De aceea sistemele moderne folosesc filtre de particule (DPF) si reductie catalitica (SCR cu AdBlue). Caldura ramasa este folosita de turbocompresor pentru a indesi aerul de admisie.',
        cylinderContent: 'exhaust',
        combustion: false,
      },
    ],
  },
  {
    id: 'two-stroke',
    name: 'Motor in 2 timpi',
    shortName: '2 timpi',
    subtitle: 'Ciclu complet la fiecare rotatie a manivelei',
    cycleDegrees: 360,
    ignitionMode: 'spark',
    color: '#a78bfa',
    glow: 'rgba(167, 139, 250, 0.55)',
    summary:
      'Motorul in 2 timpi face cele patru etape - admisie, compresie, ardere, evacuare - intr-o singura rotatie. Foloseste ferestre in cilindru si carterul ca pompa de admisie, deci este mecanic foarte simplu si livreaza putere mare la masa redusa.',
    history:
      'Schema Schnurle (1925) cu baleiaj in bucla a devenit standardul motoarelor in 2 timpi mici. Dezvoltat masiv in motociclete, drujbe, scutere si motoare de barca. Versiunile moderne cu injectie directa (Evinrude E-TEC, Orbital) elimina amestecarea cu uleiul si reduc emisiile.',
    workingPrinciple:
      'Pistonul are dublu rol: comprima amestecul deasupra si pompeaza amestec proaspat in carter dedesubt. Cand coboara aproape de PMI, descopera intai fereastra de evacuare, apoi pe cea de transfer; amestecul nou impinge gazele arse si umple cilindrul. La urcare, comprima si bujia aprinde.',
    bestFor: [
      'Drujbe, motocoase, scutere si jet-ski',
      'Motoare auxiliare cu masa minima',
      'Aplicatii unde simplitatea conteaza mai mult ca eficienta',
    ],
    tradeoffs: [
      'Pierderi de combustibil neards prin scurtcircuitare',
      'Ungere prin amestec cu ulei, mai poluant',
      'Durabilitate sensibila la calitatea uleiului si racire',
    ],
    compressionRatio: 7.5,
    combustionMode: 'mixed',
    baseEfficiency: 0.24,
    torqueBias: 1.05,
    fuelIntensity: 1.28,
    intakeValve: { open: 0, close: 0 },
    exhaustValve: { open: 0, close: 0 },
    sparkAdvance: 340,
    exhaustPort: { open: 110, close: 250 },
    scavengePort: { open: 130, close: 230 },
    specs: {
      bore: '54 mm',
      stroke: '54 mm',
      displacement: '0.124 l (1 cilindru)',
      compressionRatio: '7.5:1',
      peakPressure: '40-55 bar',
      fuel: 'Benzina + ulei (1:50)',
      airFuelRatio: '13:1 - 14:1',
      ignition: 'Bujie, scanteie controlata',
      cycleType: 'Mixt cu baleiaj prin ferestre',
      invented: 'Dugald Clerk, 1881; baleiaj Schnurle, 1925',
      typicalRpm: '2.000 - 12.000 rpm',
      typicalEfficiency: '15 - 25 %',
    },
    phases: [
      {
        id: 'compression-intake',
        name: 'Compresie + admisie in carter',
        shortName: 'Compresie',
        start: 0,
        end: 180,
        summary: 'Pistonul urca, comprima amestecul deasupra si trage amestec nou in carter.',
        detail:
          'Cand pistonul urca, deasupra lui amestecul este comprimat si pregatit pentru aprindere. In acelasi timp, dedesubt, pistonul ridicat creste volumul carterului - asta absoarbe amestec proaspat prin valva lamelara sau printr-o fereastra de admisie. Aproape de PMS, bujia da scanteia.',
        cylinderContent: 'compressed',
        combustion: false,
      },
      {
        id: 'power-scavenge',
        name: 'Putere, evacuare si transfer',
        shortName: 'Putere',
        start: 180,
        end: 360,
        summary: 'Arderea coboara pistonul; spre PMI se deschid ferestrele si gazele se schimba.',
        detail:
          'Arderea impinge pistonul in jos, generand lucru mecanic - exact ca la 4 timpi. In acelasi timp, in carter, amestecul de sub piston este comprimat. Pe masura ce pistonul coboara, descopera intai fereastra de evacuare (presiunea scade rapid), apoi pe cea de transfer; amestecul comprimat din carter urca si impinge restul de gaze prin evacuare. Aceasta este faza de baleiaj.',
        cylinderContent: 'scavenge',
        combustion: true,
      },
    ],
  },
]

export const defaultEngine = engines[0]

export function findEngine(id: EngineId): EngineDefinition {
  return engines.find((engine) => engine.id === id) ?? defaultEngine
}
