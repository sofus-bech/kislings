import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { Eyebrow, Screen, Serif } from '@/components/ui';
import { font, palette, radius } from '@/constants/theme';
import { coffees, guides } from '@/data/content';

export default function Kaffen() {
  return (
    <Screen>
      <Serif style={styles.title}>Kaffen</Serif>

      <View style={styles.list}>
        {coffees.map((c) => (
          <View key={c.id} style={styles.coffeeCard}>
            <View style={styles.photo}>
              <Image
                source={require('@/assets/images/logo-glow.png')}
                style={styles.photoImg}
                contentFit="cover"
              />
            </View>
            <View style={styles.coffeeText}>
              {c.grinder && <Eyebrow gold style={styles.grinderTag}>PÅ KVÆRNEN NU</Eyebrow>}
              <Serif style={styles.coffeeName}>{c.name}</Serif>
              <Text style={styles.dim}>{c.origin}</Text>
              <Text style={styles.notes}>{c.notes}</Text>
            </View>
          </View>
        ))}
      </View>

      <Eyebrow style={styles.sectionLabel}>BRYGGUIDES</Eyebrow>
      <View style={styles.guideGrid}>
        {guides.map((g) => (
          <View key={g.id} style={styles.guideCard}>
            <Serif style={styles.guideName}>{g.name}</Serif>
            <Text style={styles.dim}>{g.meta}</Text>
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 32, marginBottom: 24 },
  list: { gap: 14, marginBottom: 36 },
  coffeeCard: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.hairline,
    borderRadius: radius.card,
    padding: 16,
  },
  photo: { width: 64, height: 64, borderRadius: 10, overflow: 'hidden', backgroundColor: palette.hairline },
  photoImg: { width: '100%', height: '100%', opacity: 0.5 },
  coffeeText: { flex: 1 },
  grinderTag: { marginBottom: 4, fontSize: 10 },
  coffeeName: { fontSize: 20, marginBottom: 3 },
  dim: { color: palette.textDim, fontFamily: font.sans, fontSize: 12 },
  notes: { color: palette.text, fontFamily: font.sans, fontSize: 13, opacity: 0.85, marginTop: 4 },
  sectionLabel: { marginBottom: 14 },
  guideGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  guideCard: {
    flexGrow: 1,
    flexBasis: '46%',
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.hairline,
    borderRadius: radius.card,
    paddingVertical: 18,
    paddingHorizontal: 16,
  },
  guideName: { fontSize: 19, marginBottom: 6 },
});
