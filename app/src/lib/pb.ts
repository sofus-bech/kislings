import AsyncStorage from '@react-native-async-storage/async-storage';
import PocketBase from 'pocketbase';
import EventSource from 'react-native-sse';

// React Native has no global EventSource; PocketBase's realtime subscriptions
// need one. Install the polyfill before the client is created.
if (typeof (global as any).EventSource === 'undefined') {
  (global as any).EventSource = EventSource;
}

// Dev default points at the homelab LXC (LAN). Override per-environment with
// EXPO_PUBLIC_PB_URL; production will point at https://pb.kislings.dk.
export const PB_URL = process.env.EXPO_PUBLIC_PB_URL ?? 'http://192.168.1.182:8090';

export const pb = new PocketBase(PB_URL);

const KEY = 'pb_auth';

// Restore a persisted session on startup. `authReady` resolves only after the
// stored token (if any) has been loaded into the auth store, so consumers can
// await it instead of racing the async read — that race is why a reload
// previously dropped the session.
export const authReady: Promise<void> = (async () => {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (raw) {
      const { token, record } = JSON.parse(raw);
      pb.authStore.save(token, record);
    }
  } catch {
    // ignore a missing/corrupt session
  }
})();

// Persist on every auth change (login, logout, refresh).
pb.authStore.onChange((token, record) => {
  if (pb.authStore.isValid) {
    AsyncStorage.setItem(KEY, JSON.stringify({ token, record })).catch(() => {});
  } else {
    AsyncStorage.removeItem(KEY).catch(() => {});
  }
});
