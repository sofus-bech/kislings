import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

import { pb } from '@/lib/pb';

export type User = { id: string; email: string; name: string; role?: string } | null;

type AuthCtx = {
  user: User;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: { name?: string; email?: string }) => Promise<void>;
  changePassword: (oldPassword: string, password: string) => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

function currentUser(): User {
  const r = pb.authStore.record as any;
  if (!r) return null;
  return { id: r.id, email: r.email, name: r.name ?? '', role: r.role };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(currentUser());

  useEffect(() => {
    // AsyncAuthStore hydrates from storage asynchronously — reflect it and
    // keep in sync with every login/logout/refresh.
    setUser(currentUser());
    const unsub = pb.authStore.onChange(() => setUser(currentUser()));
    return () => unsub();
  }, []);

  const value = useMemo<AuthCtx>(
    () => ({
      user,
      login: async (email, password) => {
        await pb.collection('users').authWithPassword(email.trim(), password);
      },
      signup: async (name, email, password) => {
        // role is intentionally omitted — the backend forces "customer".
        await pb.collection('users').create({
          name: name.trim(),
          email: email.trim(),
          password,
          passwordConfirm: password,
        });
        await pb.collection('users').authWithPassword(email.trim(), password);
      },
      logout: () => pb.authStore.clear(),
      updateProfile: async (data) => {
        const id = pb.authStore.record?.id;
        if (!id) return;
        await pb.collection('users').update(id, data);
        await pb.collection('users').authRefresh();
      },
      changePassword: async (oldPassword, password) => {
        const rec = pb.authStore.record;
        if (!rec) return;
        await pb.collection('users').update(rec.id, {
          oldPassword,
          password,
          passwordConfirm: password,
        });
        // changing the password invalidates the current token — re-auth.
        await pb.collection('users').authWithPassword(rec.email, password);
      },
    }),
    [user],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useAuth must be used within AuthProvider');
  return c;
}
