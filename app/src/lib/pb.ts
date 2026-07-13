import AsyncStorage from '@react-native-async-storage/async-storage';
import PocketBase, { AsyncAuthStore } from 'pocketbase';
import EventSource from 'react-native-sse';

// React Native has no global EventSource; PocketBase's realtime subscriptions
// need one. Install the polyfill before the client is created.
if (typeof (global as any).EventSource === 'undefined') {
  (global as any).EventSource = EventSource;
}

// Dev default points at the homelab LXC (LAN). Override per-environment with
// EXPO_PUBLIC_PB_URL; production will point at https://pb.kislings.dk.
export const PB_URL = process.env.EXPO_PUBLIC_PB_URL ?? 'http://192.168.1.182:8090';

const authStore = new AsyncAuthStore({
  save: async (serialized) => AsyncStorage.setItem('pb_auth', serialized),
  initial: AsyncStorage.getItem('pb_auth'),
  clear: async () => AsyncStorage.removeItem('pb_auth'),
});

export const pb = new PocketBase(PB_URL, authStore);
