import { ScrollView, StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import { Stamp, stampCells } from '@/components/stamp';
import { Eyebrow } from '@/components/ui';
import { font, palette, radius } from '@/constants/theme';
import { customer } from '@/data/content';

function coffeeLine(n: number) {
  if (n >= 10) return '10 af 10 — din næste kaffe er gratis';
  const left = 10 - n;
  return `${n} af 10 — ${left} ${left === 1 ? 'kaffe' : 'kaffer'} til en gratis`;
}

function beanLine(n: number) {
  if (n >= 6) return '6 af 6 — din næste pose er gratis';
  const left = 6 - n;
  return `${n} af 6 — ${left} ${left === 1 ? 'pose' : 'poser'} til en gratis`;
}

export default function Kort() {
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      <Text style={styles.wordmark}>KISLINGS</Text>

      <View style={styles.qrSurface}>
        <QRCode
          value={customer.id}
          size={176}
          color={palette.text}
          backgroundColor={palette.surface}
        />
      </View>
      <Text style={styles.helper}>vis koden til baristaen</Text>

      {/* KAFFE — 10 */}
      <View style={styles.stampCard}>
        <Eyebrow style={styles.centered}>KAFFE</Eyebrow>
        <View style={styles.grid}>
          {stampCells(customer.coffeeStamps, 10).map((c) => (
            <View key={c.index} style={styles.cell}>
              <Stamp size={38} filled={c.filled} free={c.free} index={c.index} />
            </View>
          ))}
        </View>
        <Text style={styles.status}>{coffeeLine(customer.coffeeStamps)}</Text>
      </View>

      {/* BØNNER — 6 */}
      <View style={styles.stampCard}>
        <Eyebrow style={styles.centered}>BØNNER · 250 G</Eyebrow>
        <View style={styles.rowSix}>
          {stampCells(customer.beanStamps, 6).map((c) => (
            <View key={c.index} style={styles.cell}>
              <Stamp size={38} filled={c.filled} free={c.free} index={c.index} />
            </View>
          ))}
        </View>
        <Text style={styles.status}>{beanLine(customer.beanStamps)}</Text>
      </View>

      <Text style={styles.footer}>stemplet ved kassen — kop for kop, pose for pose</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.bg },
  content: { paddingTop: 76, paddingHorizontal: 24, paddingBottom: 120, alignItems: 'center' },
  wordmark: {
    fontFamily: font.serifMedium,
    color: palette.text,
    fontSize: 19,
    letterSpacing: 3.4,
    marginBottom: 34,
  },
  qrSurface: {
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.hairline,
    borderRadius: radius.loyalty,
    padding: 24,
  },
  helper: { color: palette.textDim, fontFamily: font.sans, fontSize: 13, marginTop: 16, marginBottom: 40 },
  stampCard: {
    width: '100%',
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.hairline,
    borderRadius: radius.loyalty,
    padding: 20,
    marginBottom: 16,
  },
  centered: { textAlign: 'center', marginBottom: 16 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 16,
  },
  rowSix: { flexDirection: 'row', justifyContent: 'center', marginBottom: 16 },
  cell: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  status: { color: palette.text, fontFamily: font.sans, fontSize: 13, textAlign: 'center' },
  footer: { color: palette.textDim, fontFamily: font.sans, fontSize: 12, textAlign: 'center', marginTop: 4 },
});
