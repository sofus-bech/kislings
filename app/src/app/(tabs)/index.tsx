import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { Stamp, stampCells } from '@/components/stamp';
import { Eyebrow, Screen, Serif } from '@/components/ui';
import { font, palette, radius } from '@/constants/theme';
import { customer, nextEvent } from '@/data/content';
import { useCoffees, useNews } from '@/lib/live';

export default function Hjem() {
  const coffees = useCoffees();
  const news = useNews();
  const grinder = coffees.find((c) => c.grinder) ?? coffees[0];
  const latest = news[0];

  return (
    <Screen>
      {/* header */}
      <View style={styles.header}>
        <View>
          <Eyebrow>godmorgen</Eyebrow>
          <Serif style={styles.name}>{customer.name}</Serif>
        </View>
        <Text style={styles.wordmark}>KISLINGS</Text>
      </View>

      {/* PÅ KVÆRNEN */}
      <View style={styles.card}>
        <Eyebrow gold>PÅ KVÆRNEN</Eyebrow>
        <Serif style={styles.grinderName}>{grinder.name}</Serif>
        <Text style={styles.dim}>{grinder.origin}</Text>
        <Text style={styles.body}>{grinder.notes}</Text>
      </View>

      {/* condensed loyalty */}
      <View style={styles.card}>
        <Eyebrow style={styles.loyaltyLabel}>KAFFE</Eyebrow>
        <View style={styles.loyaltyRow}>
          <View style={styles.miniStamps}>
            {stampCells(customer.coffeeStamps, 10).map((c) => (
              <Stamp key={c.index} size={16} filled={c.filled} free={c.free} index={c.index} />
            ))}
          </View>
          <Text style={styles.dim}>{customer.coffeeStamps} af 10</Text>
        </View>
      </View>

      {/* news */}
      <Eyebrow style={styles.sectionLabel}>NYHEDER</Eyebrow>
      <View style={styles.newsCard}>
        <View style={styles.newsPhoto}>
          <Image source={require('@/assets/images/logo-glow.png')} style={styles.newsImg} contentFit="cover" />
        </View>
        <View style={styles.newsBody}>
          <Serif style={styles.newsTitle}>{latest.title}</Serif>
          <Text style={styles.dim}>{latest.date}</Text>
        </View>
      </View>

      {/* next event */}
      <View style={styles.eventRow}>
        <Eyebrow>NÆSTE ARRANGEMENT</Eyebrow>
        <Text style={styles.eventText}>{nextEvent}</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  name: { fontSize: 32, lineHeight: 35, marginTop: 6 },
  wordmark: {
    fontFamily: font.serifMedium,
    color: palette.text,
    fontSize: 17,
    letterSpacing: 2.7,
    paddingTop: 4,
  },
  card: {
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.hairline,
    borderRadius: radius.card,
    padding: 20,
    marginBottom: 32,
  },
  grinderName: { fontSize: 26, marginTop: 10, marginBottom: 6 },
  dim: { color: palette.textDim, fontFamily: font.sans, fontSize: 13 },
  body: { color: palette.text, fontFamily: font.sans, fontSize: 14, lineHeight: 21, marginTop: 10 },
  loyaltyLabel: { marginBottom: 12 },
  loyaltyRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  miniStamps: { flexDirection: 'row', gap: 7 },
  sectionLabel: { marginBottom: 14 },
  newsCard: {
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.hairline,
    borderRadius: radius.card,
    overflow: 'hidden',
    marginBottom: 32,
  },
  newsPhoto: { height: 150, backgroundColor: palette.hairline },
  newsImg: { width: '100%', height: '100%', opacity: 0.5 },
  newsBody: { padding: 18 },
  newsTitle: { fontSize: 19, marginBottom: 5 },
  eventRow: { borderTopWidth: 1, borderTopColor: palette.hairline, paddingTop: 18 },
  eventText: { color: palette.text, fontFamily: font.sans, fontSize: 14, marginTop: 6 },
});
