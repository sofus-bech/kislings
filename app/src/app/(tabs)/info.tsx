import * as Clipboard from 'expo-clipboard';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { Eyebrow, Screen, Serif } from '@/components/ui';
import { font, palette, radius } from '@/constants/theme';
import { contacts, hours, wifi } from '@/data/content';

export default function Info() {
  const [copied, setCopied] = useState(false);

  const copyWifi = async () => {
    await Clipboard.setStringAsync(wifi.password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const openMaps = () =>
    Linking.openURL('https://maps.apple.com/?q=Perlegade+49,+6400+Sønderborg');

  return (
    <Screen>
      <Serif style={styles.title}>Info</Serif>

      <Pressable onPress={openMaps} style={styles.map}>
        <Image
          source={require('@/assets/images/logo-glow.png')}
          style={styles.mapImg}
          contentFit="cover"
        />
      </Pressable>
      <Text style={styles.address}>Perlegade 49, 6400 Sønderborg</Text>
      <Text style={styles.addressSub}>to minutter fra Rådhustorvet</Text>

      <Eyebrow style={styles.sectionLabel}>ÅBNINGSTIDER</Eyebrow>
      <View style={styles.hoursBlock}>
        {hours.map((h) => (
          <View key={h.day} style={styles.hourRow}>
            <View style={styles.hourLine}>
              <Text style={styles.day}>{h.day}</Text>
              <Text style={styles.time}>{h.time}</Text>
            </View>
            {!!h.note && <Text style={styles.hourNote}>{h.note}</Text>}
          </View>
        ))}
      </View>

      <View style={styles.wifiCard}>
        <View>
          <Eyebrow style={styles.wifiLabel}>WI-FI</Eyebrow>
          <Text style={styles.ssid}>{wifi.ssid}</Text>
          <Text style={styles.password}>{wifi.password}</Text>
        </View>
        <Pressable onPress={copyWifi} style={styles.copyBtn}>
          <Text style={styles.copyLabel}>{copied ? 'kopieret' : 'kopiér'}</Text>
        </Pressable>
      </View>

      <Text style={styles.reservation}>
        bordreservation i caféen, min. 4 personer — ring eller skriv.
      </Text>

      <Eyebrow style={styles.sectionLabel}>KONTAKT</Eyebrow>
      <View>
        {contacts.map((k) => (
          <Pressable key={k.label} onPress={() => Linking.openURL(k.href)} style={styles.contactRow}>
            <Text style={styles.contactLabel}>{k.label}</Text>
            <Text style={styles.contactValue}>{k.value}</Text>
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 32, marginBottom: 24 },
  map: { height: 150, borderRadius: radius.card, overflow: 'hidden', marginBottom: 14, backgroundColor: palette.hairline },
  mapImg: { width: '100%', height: '100%', opacity: 0.5 },
  address: { color: palette.text, fontFamily: font.sans, fontSize: 14, marginBottom: 4 },
  addressSub: { color: palette.textDim, fontFamily: font.sans, fontSize: 12, marginBottom: 32 },
  sectionLabel: { marginBottom: 6 },
  hoursBlock: { marginBottom: 32 },
  hourRow: { borderBottomWidth: 1, borderBottomColor: palette.hairline, paddingVertical: 14 },
  hourLine: { flexDirection: 'row', justifyContent: 'space-between' },
  day: { color: palette.text, fontFamily: font.sans, fontSize: 14 },
  time: { color: palette.text, fontFamily: font.sans, fontSize: 14 },
  hourNote: { color: palette.textDim, fontFamily: font.sans, fontSize: 12, marginTop: 4 },
  wifiCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.hairline,
    borderRadius: radius.card,
    padding: 18,
    marginBottom: 20,
  },
  wifiLabel: { marginBottom: 8 },
  ssid: { color: palette.text, fontFamily: font.sans, fontSize: 15, marginBottom: 2 },
  password: { color: palette.textDim, fontFamily: font.sans, fontSize: 13 },
  copyBtn: {
    borderWidth: 1,
    borderColor: palette.hairline,
    borderRadius: 999,
    paddingVertical: 9,
    paddingHorizontal: 16,
  },
  copyLabel: { color: palette.text, fontFamily: font.sansMedium, fontSize: 12 },
  reservation: { color: palette.textDim, fontFamily: font.sans, fontSize: 13, lineHeight: 21, marginBottom: 32 },
  contactRow: {
    borderBottomWidth: 1,
    borderBottomColor: palette.hairline,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contactLabel: { color: palette.textDim, fontFamily: font.sans, fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.6 },
  contactValue: { color: palette.text, fontFamily: font.sans, fontSize: 14 },
});
