import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Eyebrow, Screen, Serif } from '@/components/ui';
import { font, palette, radius } from '@/constants/theme';
import { useAuth } from '@/lib/auth';

function errorText(e: any): string {
  return e?.response?.message || e?.message || 'Noget gik galt. Prøv igen.';
}

function Field(props: React.ComponentProps<typeof TextInput> & { label: string }) {
  const { label, ...rest } = props;
  return (
    <View style={styles.field}>
      <Eyebrow style={styles.fieldLabel}>{label}</Eyebrow>
      <TextInput
        placeholderTextColor={palette.textDim}
        style={styles.input}
        autoCapitalize="none"
        {...rest}
      />
    </View>
  );
}

function Button({ label, onPress, busy, kind = 'primary' }: {
  label: string;
  onPress: () => void;
  busy?: boolean;
  kind?: 'primary' | 'ghost';
}) {
  return (
    <Pressable onPress={onPress} disabled={busy} style={[styles.btn, kind === 'ghost' && styles.btnGhost]}>
      {busy ? (
        <ActivityIndicator color={kind === 'primary' ? palette.bg : palette.text} />
      ) : (
        <Text style={[styles.btnLabel, kind === 'ghost' && styles.btnGhostLabel]}>{label}</Text>
      )}
    </Pressable>
  );
}

function AuthForm() {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    setError('');
    setBusy(true);
    try {
      if (mode === 'signup') await signup(name, email, password);
      else await login(email, password);
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Serif style={styles.title}>Profil</Serif>
      <Text style={styles.lede}>
        {mode === 'login'
          ? 'log ind for at bruge dit stempelkort'
          : 'opret en konto og saml stempler'}
      </Text>

      {mode === 'signup' && (
        <Field label="NAVN" value={name} onChangeText={setName} placeholder="dit navn" autoCapitalize="words" />
      )}
      <Field
        label="EMAIL"
        value={email}
        onChangeText={setEmail}
        placeholder="dig@eksempel.dk"
        keyboardType="email-address"
        autoComplete="email"
      />
      <Field
        label="ADGANGSKODE"
        value={password}
        onChangeText={setPassword}
        placeholder="mindst 8 tegn"
        secureTextEntry
      />

      {!!error && <Text style={styles.error}>{error}</Text>}

      <Button label={mode === 'login' ? 'Log ind' : 'Opret konto'} onPress={submit} busy={busy} />

      <Pressable onPress={() => { setError(''); setMode(mode === 'login' ? 'signup' : 'login'); }}>
        <Text style={styles.switch}>
          {mode === 'login' ? 'Har du ikke en konto? Opret en' : 'Har du allerede en konto? Log ind'}
        </Text>
      </Pressable>
    </>
  );
}

function ProfileView() {
  const { user, logout, updateProfile, changePassword } = useAuth();
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const save = async () => {
    setMsg(''); setError(''); setBusy(true);
    try {
      await updateProfile({ name, email });
      setMsg('gemt');
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  };

  const savePassword = async () => {
    setMsg(''); setError(''); setBusy(true);
    try {
      await changePassword(oldPassword, newPassword);
      setOldPassword(''); setNewPassword(''); setShowPw(false);
      setMsg('adgangskode ændret');
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Serif style={styles.title}>Profil</Serif>
      <Text style={styles.lede}>{user?.email}</Text>

      <Field label="NAVN" value={name} onChangeText={setName} placeholder="dit navn" autoCapitalize="words" />
      <Field label="EMAIL" value={email} onChangeText={setEmail} placeholder="dig@eksempel.dk" keyboardType="email-address" />

      {!!msg && <Text style={styles.ok}>{msg}</Text>}
      {!!error && <Text style={styles.error}>{error}</Text>}

      <Button label="Gem" onPress={save} busy={busy} />

      {showPw ? (
        <View style={styles.pwBlock}>
          <Field label="NUVÆRENDE ADGANGSKODE" value={oldPassword} onChangeText={setOldPassword} secureTextEntry />
          <Field label="NY ADGANGSKODE" value={newPassword} onChangeText={setNewPassword} placeholder="mindst 8 tegn" secureTextEntry />
          <Button label="Skift adgangskode" onPress={savePassword} busy={busy} />
        </View>
      ) : (
        <Button label="Skift adgangskode" onPress={() => setShowPw(true)} kind="ghost" />
      )}

      <Button label="Log ud" onPress={logout} kind="ghost" />
    </>
  );
}

export default function Profil() {
  const { user } = useAuth();
  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Screen>{user ? <ProfileView /> : <AuthForm />}</Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  title: { fontSize: 32, marginBottom: 8 },
  lede: { color: palette.textDim, fontFamily: font.sans, fontSize: 13, marginBottom: 28 },
  field: { marginBottom: 16 },
  fieldLabel: { marginBottom: 8 },
  input: {
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.hairline,
    borderRadius: radius.card,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: palette.text,
    fontFamily: font.sans,
    fontSize: 15,
  },
  error: { color: '#C86A66', fontFamily: font.sans, fontSize: 13, marginBottom: 12 },
  ok: { color: palette.gold, fontFamily: font.sans, fontSize: 13, marginBottom: 12 },
  btn: {
    backgroundColor: palette.gold,
    borderRadius: 999,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  btnLabel: { color: palette.bg, fontFamily: font.sansSemi, fontSize: 15 },
  btnGhost: { backgroundColor: 'transparent', borderWidth: 1, borderColor: palette.hairline },
  btnGhostLabel: { color: palette.text },
  switch: { color: palette.textDim, fontFamily: font.sansMedium, fontSize: 13, textAlign: 'center', marginTop: 8 },
  pwBlock: { marginTop: 4 },
});
