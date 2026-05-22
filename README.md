# YTPlayer

Player musicale personale che estrae audio da YouTube via **yt-dlp**, senza ads e senza Premium.
Pensato per girare su iPhone (background audio + lock screen + auto via **Bluetooth**), con un backend Node.js sul tuo server di casa.

```
┌─────────────────┐      LAN       ┌────────────────────┐
│  iPhone / App   │ ◄────────────► │  Server di casa    │
│  React Native   │   HTTP/Range   │  Node + yt-dlp     │
│  Expo + TS      │                │  Express proxy     │
└────────┬────────┘                └────────────────────┘
         │ Bluetooth A2DP + AVRCP
         ▼
   Stereo auto / cuffie / speaker
```

## Struttura

```
ytplayer/
├── backend/    Node.js + Express + yt-dlp (gira sul server di casa)
└── app/        React Native + Expo (iPhone, Android)
```

## Quick start

### 1. Backend (sul server di casa)

```bash
cd backend
npm install
cp .env.example .env
npm start
```

Richiede `yt-dlp` e `ffmpeg` nel PATH. Dettagli in [backend/README.md](backend/README.md).

Annota l'IP locale del server (es. `192.168.1.42`) — ti servirà per l'app.

### 2. App (sulla tua macchina Windows)

```bash
cd app
npm install
cp .env.example .env
# Modifica .env: EXPO_PUBLIC_API_URL=http://<IP-SERVER>:3000
```

#### Test rapido su Android Emulator

```bash
npm run prebuild
npm run android
```

> Nota: `react-native-track-player` è un native module e non gira in Expo Go.
> Per Android serve una dev build (sopra) o EAS Build.

#### Build per iPhone — **gratis** (via GitHub Actions, senza Apple Developer Program)

> EAS Build richiede un Apple Developer account a pagamento (99€/anno) per produrre IPA installabili. Aggiriamo questo limite usando **GitHub Actions** con un runner macOS gratuito.
> Il workflow `.github/workflows/ios-build.yml` produce un IPA **unsigned** che poi AltStore firma con il tuo Apple ID gratuito al momento dell'installazione.

##### Setup una tantum

1. **Crea repo GitHub** (privato va benissimo)
   ```bash
   cd C:\Users\andre\Desktop\ytplayer
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<tuo-user>/ytplayer.git
   git push -u origin main
   ```

2. **Configura GitHub Secrets** (altrimenti l'IPA punterà a un IP placeholder)
   - GitHub repo → Settings → Secrets and variables → Actions → New repository secret
   - Crea: `EXPO_PUBLIC_API_URL` = `http://<IP-server>:3000` (es. `http://192.168.1.42:3000`)
   - Opzionalmente: `EXPO_PUBLIC_API_TOKEN` = il token che hai messo nel backend `.env`

3. **Installa AltStore + AltServer** sul PC Windows: [altstore.io](https://altstore.io)
   - AltServer su Windows (eseguibile)
   - AltStore sull'iPhone (installato via AltServer + cavo USB la prima volta)

##### Ogni build (5 minuti di lavoro tuo, 15-20 di build sul cloud)

1. **Lancia la build su GitHub**
   - Vai su `https://github.com/<tuo-user>/ytplayer/actions`
   - Click su workflow "Build iOS IPA (unsigned, for AltStore sideloading)"
   - Click "Run workflow" → "Run workflow"
   - Aspetta ~15-20 minuti

2. **Scarica l'IPA**
   - Quando il workflow è verde, apri il run
   - Sezione "Artifacts" → scarica `ytplayer-ios-unsigned-N`
   - Estrai il `.ipa` dallo zip

3. **Installa via AltStore**
   - Trasferisci il `.ipa` sull'iPhone (AirDrop, iCloud Drive, email)
   - Apri l'IPA → si apre AltStore → click "Install"
   - AltStore lo firma con il tuo Apple ID gratuito e installa
   - **Re-firma ogni 7 giorni** automatica se AltServer è in esecuzione sul PC in LAN

##### Quote GitHub Actions

- Repo **pubblico**: macOS runner illimitato gratis
- Repo **privato**: 200 minuti macOS/mese gratis (~10 build da 20 min)

Per uso personale di solito basta. Se finisci i minuti, fai il repo pubblico (niente segreti nel codice — l'IP del backend è in `.env` che è gitignorato).

#### Sviluppo veloce con dev client

Dopo aver installato la build sull'iPhone, per iterare velocemente sul codice:

```bash
npm start
```

L'app si riconnetterà al Metro bundler sul tuo PC in LAN, hot-reload incluso. La build dura 7 giorni — devi rifarla solo quando aggiungi/cambi native modules o configurazione iOS.

#### Alternativa — EAS Build (se hai 99€/anno da spendere)

Se in futuro vuoi semplificare (no 7-day re-sign, no GitHub Actions), puoi prendere l'Apple Developer Program e usare EAS Build:

```bash
npm install -g eas-cli
eas login
npm run build:ios:preview
```

Gli script EAS sono già in `package.json`. Niente vieta di usare ENTRAMBI i percorsi nel tempo.

## Funzionalità

| | |
|---|---|
| Ricerca YouTube via backend | ✅ |
| Riproduzione audio (no ads) | ✅ |
| Coda di riproduzione | ✅ |
| Shuffle / Repeat (off / queue / track) | ✅ |
| Controlli lock screen + Control Center | ✅ (via react-native-track-player) |
| Background audio (schermo spento) | ✅ (UIBackgroundModes: audio) |
| Audio in auto via Bluetooth | ✅ (A2DP automatico) |
| Tasti play/pause/skip al volante | ✅ (AVRCP, automatico) |
| Titolo + artista sul display auto | ✅ (AVRCP metadata) |
| Comandi vocali Siri | ✅ ("Hey Siri, prossimo brano") |
| UI dark, simile a Spotify/Apple Music | ✅ |
| Brani recenti persistiti | ✅ |
| Ricerche recenti persistite | ✅ |

## Uso in auto

L'app è pensata per uso "metti su una coda e guida":

1. **Monta il telefono** in auto (supporto a ventosa o magnetico, 10-15€)
2. **Collega Bluetooth** all'auto la prima volta (procedura standard del veicolo)
3. **Prima di partire**: apri l'app, scegli una ricerca o una coda, fai play
4. **Schermo si spegne**: l'audio continua, lock screen mostra Now Playing
5. **Tasti al volante**: play/pausa/skip funzionano tramite AVRCP
6. **Siri hands-free**: "Hey Siri, pausa" / "prossimo brano" / "play"

Quasi tutte le auto dal ~2015 in poi mostrano titolo e artista sul display di bordo via Bluetooth metadata.

## Note tecniche

### Perché serve una build nativa (non Expo Go)

`react-native-track-player` è un modulo nativo (Kotlin/Swift). Expo Go è un binario pre-compilato che non può caricarlo. Hai due opzioni:

1. **EAS Build** (cloud, no Mac) — quello che facciamo qui.
2. **Prebuild + Xcode** (richiede Mac) — `expo prebuild` poi apri `ios/` in Xcode.

L'opzione 1 va benissimo da Windows e supporta firma con Apple ID gratuito.

### Streaming: proxy vs URL diretto

L'app usa `/api/stream/:id` (proxy attraverso il tuo server) di default — più affidabile, supporta Range requests per il seeking, non scade.
`/api/stream-url/:id` restituisce l'URL diretto di YouTube — più veloce ma può scadere e a volte non funziona con player nativi che non gestiscono i redirect HLS.

### Auto-aggiornamento yt-dlp

YouTube cambia spesso. Tieni `yt-dlp` aggiornato sul server:

```bash
yt-dlp -U
```

Oppure usa un cron settimanale.

### Configurazione IP backend

L'IP del server è in `app/.env` come `EXPO_PUBLIC_API_URL`. Se cambi rete (es. casa → ufficio), aggiorna l'IP e rilancia.
Per uso ovunque, considera:
- DDNS + port-forward (ngrok / cloudflare tunnel per testing rapido)
- VPN domestica (WireGuard sul server)

## Sviluppo

```bash
# Backend
cd backend && npm run dev      # node --watch, ricarica automatica

# App
cd app
npm start                       # Metro bundler
npm run typecheck               # tsc --noEmit
```

## Disclaimer

Strumento per uso strettamente personale. Rispetta i termini di servizio di YouTube e i diritti d'autore. Non distribuire sul Play Store / App Store pubblicamente.
