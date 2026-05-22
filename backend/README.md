# YTPlayer Backend

Proxy Node.js + Express che usa **yt-dlp** per cercare e streammare audio da YouTube.
Pensato per girare sul tuo server di casa e servire l'app YTPlayer in LAN.

## Prerequisiti

- **Node.js >= 20** ([download](https://nodejs.org))
- **yt-dlp** installato e nel PATH ([guida](https://github.com/yt-dlp/yt-dlp/wiki/Installation))
  - macOS: `brew install yt-dlp`
  - Linux: `sudo apt install yt-dlp` oppure scarica il binario
  - Windows: `winget install yt-dlp` oppure scarica `yt-dlp.exe`
- **ffmpeg** (consigliato — usato da yt-dlp per remuxing)

Verifica:
```bash
yt-dlp --version
ffmpeg -version
```

## Setup

```bash
cd backend
npm install
cp .env.example .env
# (Modifica .env se vuoi — di default va bene)
npm start
```

Output atteso:
```
  YTPlayer Backend in ascolto su http://0.0.0.0:3000
  LAN — usa l'IP del server (es. http://192.168.x.x:3000) dall'app
```

## Endpoints

| Metodo | URL | Descrizione |
|---|---|---|
| GET | `/health` | health check |
| GET | `/api/search?q=<query>&limit=<n>` | cerca brani su YouTube |
| GET | `/api/info/:id` | metadati completi di un video |
| GET | `/api/stream-url/:id` | URL diretto allo stream audio + mimeType |
| GET | `/api/stream/:id` | proxy dello stream audio (supporta Range, ideale per seeking) |

Esempi:
```bash
curl "http://localhost:3000/api/search?q=daft+punk+harder+better"
curl "http://localhost:3000/api/info/gAjR4_CbPpQ"
curl -o test.m4a "http://localhost:3000/api/stream/gAjR4_CbPpQ"
```

## Configurazione (.env)

| Variabile | Default | Descrizione |
|---|---|---|
| `PORT` | `3000` | Porta in ascolto |
| `HOST` | `0.0.0.0` | Bind address |
| `YTDLP_PATH` | — | Percorso al binario yt-dlp (vuoto = usa PATH) |
| `CACHE_TTL` | `3600` | TTL cache metadati in secondi |
| `MAX_SEARCH_RESULTS` | `20` | Max risultati per ricerca |
| `API_TOKEN` | — | Se impostato, richiede header `x-api-token` |

## Esecuzione come servizio (Linux / systemd)

`/etc/systemd/system/ytplayer.service`:
```ini
[Unit]
Description=YTPlayer Backend
After=network.target

[Service]
Type=simple
User=youruser
WorkingDirectory=/opt/ytplayer/backend
ExecStart=/usr/bin/node src/server.js
Restart=always
EnvironmentFile=/opt/ytplayer/backend/.env

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now ytplayer
sudo journalctl -fu ytplayer
```

## Note

- **Stream vs Stream-URL**: `/api/stream` proxa l'audio attraverso il server (più traffico ma niente problemi di CORS, IP, scadenza token). `/api/stream-url` restituisce l'URL diretto di YouTube — più veloce ma può scadere e potrebbe non funzionare in tutti i contesti.
  L'app YTPlayer usa `/api/stream` di default.
- yt-dlp va aggiornato regolarmente (`yt-dlp -U`) per rimanere compatibile con YouTube.
- Per uso esclusivamente personale e domestico.
