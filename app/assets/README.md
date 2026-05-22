# Assets

Cartella per le immagini personalizzate dell'app (opzionale).

Per ora `app.json` non referenzia file in questa cartella, quindi Expo usa **le icone di default**. La build funziona così com'è.

## Quando vorrai un'icona tua

1. Crea `icon.png` (1024×1024) — sarà l'icona dell'app
2. Opzionale: `splash.png` (es. 1284×2778) — splash screen iOS
3. Riaggiungi le reference in `app.json`:

```json
{
  "expo": {
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#0a0a0f"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/icon.png",
        "backgroundColor": "#0a0a0f"
      }
    }
  }
}
```

4. Re-trigger del workflow GitHub Actions → nuova IPA con la tua icona

Tip: il sito [icon.kitchen](https://icon.kitchen) genera icon set completi da un solo PNG.
