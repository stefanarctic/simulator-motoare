# Simulator motoare cu ardere internă

Aplicație web educativă (React + TypeScript + Vite) care vizualizează cinematica **bielă–manivelă**, fazele ciclului, diagrama **P–V** și metrici estimate pentru mai multe tipuri de motor.

Acest ghid îți arată cum să folosești aplicația fără să intri în cod sau în fizică avansată. Simulatorul este **educativ**: arată cinematica pistonului (bielă–manivelă), fazele ciclului, un ciclu **P–V** (presiune–volum) și valori estimate în timp real.

---

## La ce să te aștepți

- **Nu** este un instrument de măsură industrial sau un model CFD. Numerele sunt **calibrate să fie plauzibile și să reflecte comportamentul calitativ** (care fază urmează, cum evoluează presiunea etc.), nu înlocuiesc un banc de probe real.
- Poți **învăța vizual**: cum se mișcă pistonul, când sunt deschise supapele sau porturile, cum arată un ciclu termodinamic idealizat pe diagramă.

---

## Pornire rapidă (local)

1. Instalează dependențele: `npm install`
2. Pornește aplicația: `npm run dev`
3. Deschide în browser adresa afișată (de obicei `http://localhost:5173`)

Dacă folosești o versiune găzduită online, deschide linkul — nu ai nevoie de terminal.

### Scripturi npm

| Script | Descriere |
|--------|-----------|
| `npm run dev` | Server de dezvoltare Vite |
| `npm run build` | Compilare TypeScript + build producție |
| `npm run preview` | Previzualizare build local |
| `npm run lint` | ESLint |

---

## Structura ecranului

### Antet

Titlul și descrierea scurtă rezumă scopul: **vizualizare educațională** a motorului, cu cinematica bielă–manivelă și explicații pe faze.

### Panoul din stânga — „Configurare simulare”

| Element | Rol |
|--------|-----|
| **Carduri de motor** | Alegi tipul: benzina 4 timpi, diesel 4 timpi sau motor în 2 timpi. Pe fiecare card vezi și **raportul de compresie** afișat ca reper rapid. |
| **Pornește / Pauză** | Pornește sau oprește derularea timpului. Poți regla parametrii și în timpul rulării. |
| **Pasul următor** | Oprește redarea și sare **la începutul următoarei faze** din ciclu (util pentru lecții pas cu pas). |
| **Resetează la 0°** | Revine la începutul ciclului (unghi 0°). |
| **Viteza timpului** | Multiplicator pentru **cât de repede** trece simularea, **independent** de turația motorului. Valori mici = ciclu mai lent, mai ușor de urmărit. |
| **Turație motor** | Rotații pe minut (rpm). Cu cât e mai mare, cu atât ciclul se repetă mai repede (în timp real al simulării). |
| **Accelerație** | Cât de „deschis” este acceleratorul (0–100%). Influențează în special admiterea și presiunea în cilindru. |
| **Sarcină mecanică** | Cât de solicitat este motorul din punct de vedere al cuplului (10–100%). La sarcină mare, arderea modelează mai multă căldură eliberată. |

### Zona centrală — vizualizare

- **Motorul animat** — arată manivela, biela, pistonul, supape sau porturi (în funcție de motor), bujie sau injectie, și fluxuri estimate pe admisie/evacuare când e cazul.
- **Timeline ciclu** — bandă cu **fazele** ciclului pe cele **720°** (4 timpi) sau **360°** (2 timpi). Vezi un cursor care arată **poziția curentă** în ciclu. Poți **da clic pe o fază** pentru a sări direct acolo (redarea se oprește ca să poți studia momentul).
- **Diagrama P–V** — presiune în funcție de volum pentru un ciclu; pe curbă apare și **punctul curent** al stării simulate. Ajută să leagi mișcarea pistonului de „forma” ciclului termodinamic.

### Panoul din dreapta — „Informații live”

Aici vezi:

- **Numele fazei curente** și un **rezumat scurt** al ce se întâmplă.
- **Indicatori** (cuplu relativ, putere estimată, consum relativ, eficiență termică, presiune și temperatură în cilindru) — toate sunt **relative sau estimate** în cadrul modelului, nu citiri de senzor real.
- **Progres în fază** — cât la sută din faza curentă ai parcurs.

### Zona de jos — detalii și comparație

Secțiunea mai lungă de pe pagină include:

- **Principiul de funcționare** și **istorie** în limbaj accesibil.
- **Specificații tehnice** (alesuri tipice: cilindree, raport compresie, combustibil, tip ciclu etc.).
- **Fazele în detaliu** — pentru fiecare interval de grade din ciclu, o explicație mai lungă.
- **Comparație rapidă** între tipurile de motor disponibile în simulator (tabel).

---

## Cele trei tipuri de motor din simulator

1. **Motor pe benzină, 4 timpi** — ciclu Otto, aprindere prin scânteie; ciclu complet = **720°** arborie (două rotații complete).
2. **Motor diesel, 4 timpi** — aprindere prin compresie; tot **720°** pentru un ciclu complet la arborie.
3. **Motor în 2 timpi** — ciclu mai scurt pe arborie (**360°**); în model apar și aspecte specifice precum **scavenging** (schimbarea gazelor), în funcție de datele motorului.

---

## Sfaturi pentru învățare sau prezentare

1. Începe cu **viteza timpului** mică și **turație** moderată ca să urmărești pistonul și timeline-ul fără grabă.
2. Folosește **Pasul următor** și **clic pe faze** în timeline ca să **oprești** simularea exact la momentul care te interesează.
3. Urmărește simultan **diagrama P–V** și poziția pistonului — îți întărește legătura între volumul din cilindru și presiune.
4. Citește disclaimer-ul din subsolul aplicației: valorile sunt **ilustrative**, nu pentru proiectare inginerească precisă.

---

## Limitări importante

- Model simplificat: nu înlocuiește măsurători reale, software CFD sau date de dyno.
- Parametrii „Accelerație” și „Sarcină” influențează **modelul educativ**, nu reproduc fidel un motor anume din catalog.

Valorile afișate în interfață sunt **ilustrative** și calibrate pentru comportament calitativ corect; nu înlocuiesc un model CFD sau măsurători pe banc.

Pentru implementare (geometrie piston, curbe P–V etc.), vezi codul din `src/lib` și `src/data`.
