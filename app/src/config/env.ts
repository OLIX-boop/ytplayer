import Constants from 'expo-constants';

function readEnv(key: string, fallback = ''): string {
  const fromProcess = (process.env as Record<string, string | undefined>)[key];
  if (fromProcess) return fromProcess;
  const fromManifest = (Constants.expoConfig?.extra as Record<string, string | undefined> | undefined)?.[key];
  return fromManifest || fallback;
}

export const API_URL = readEnv('EXPO_PUBLIC_API_URL', 'http://192.168.1.10:3000').replace(/\/+$/, '');
export const API_TOKEN = readEnv('EXPO_PUBLIC_API_TOKEN', '');

if (!API_URL) {
  console.warn(
    '[YTPlayer] EXPO_PUBLIC_API_URL non configurato. Crea un file .env nella root dell\'app e imposta l\'IP del tuo backend.'
  );
}
