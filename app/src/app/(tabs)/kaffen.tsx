import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Eyebrow, Screen, Serif } from '@/components/ui';
import { font, palette, radius } from '@/constants/theme';
import { useCoffees, useGuides } from '@/lib/live';

export default function Kaffen() {
  const router = useRouter();
  const coffees = useCoffees();
  const guides = useGuides();
  return (
    <Screen>
      <Serif style={styles.title}>Kaffen</Serif>

      <View style={styles.list}>
        {coffees.map((c) => (
          <Pressable
            key={c.id}
            style={styles.coffeeCard}
            onPress={() => router.push({ pathname: '/coffee/[id]', params: { id: c.id } })}>
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
          </Pressable>
        ))}
      </View>

      <Eyebrow style={styles.sectionLabel}>BRYGGUIDES</Eyebrow>
      <View style={styles.guideGrid}>
        {guides.map((g) => (
          <Pressable
            key={g.id}
            style={styles.guideCard}
            onPress={() => router.push({ pathname: '/guide/[id]', params: { id: g.id } })}>
            <Serif style={styles.guideName}>{g.name}</Serif>
            <Text style={styles.dim}>{g.meta}</Text>
          </Pressable>
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
