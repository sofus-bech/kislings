import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Eyebrow, Serif } from '@/components/ui';
import { font, palette } from '@/constants/theme';
import { useCoffees } from '@/lib/live';

export default function CoffeeDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const coffee = useCoffees().find((c) => c.id === id);

  if (!coffee) return <View style={styles.screen} />;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <Image source={require('@/assets/images/logo-glow.png')} style={styles.heroImg} contentFit="cover" />
        <View style={styles.scrimTop} />
        <View style={styles.scrimBottom} />
        <Pressable onPress={() => router.back()} style={styles.back} hitSlop={10}>
          <Text style={styles.backIcon}>←</Text>
        </Pressable>
      </View>

      <View style={styles.body}>
        {coffee.grinder && <Eyebrow gold style={styles.tag}>PÅ KVÆRNEN NU</Eyebrow>}
        <Serif style={styles.name}>{coffee.name}</Serif>
        <Text style={styles.dim}>{coffee.origin}</Text>
        <View style={styles.notesBand}>
          <Text style={styles.notes}>{coffee.notes}</Text>
        </View>
        <Text style={styles.story}>{coffee.story}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.bg },
  content: { paddingBottom: 110 },
  hero: { height: 320, position: 'relative' },
  heroImg: { width: '100%', height: '100%', opacity: 0.5 },
  scrimTop: { position: 'absolute', top: 0, left: 0, right: 0, height: 120, backgroundColor: 'rgba(13,12,11,0.35)' },
  scrimBottom: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 160, backgroundColor: 'rgba(13,12,11,0.75)' },
  back: {
    position: 'absolute',
    top: 64,
    left: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(13,12,11,0.55)',
    borderWidth: 1,
    borderColor: palette.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: { color: palette.text, fontSize: 16 },
  body: { paddingHorizontal: 22, marginTop: -36 },
  tag: { marginBottom: 10 },
  name: { fontSize: 34, lineHeight: 37, marginBottom: 8 },
  dim: { color: palette.textDim, fontFamily: font.sans, fontSize: 13, marginBottom: 18 },
  notesBand: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: palette.hairline,
    paddingVertical: 14,
    marginBottom: 22,
  },
  notes: { color: palette.text, fontFamily: font.sans, fontSize: 14 },
  story: { color: palette.text, fontFamily: font.sans, fontSize: 15, lineHeight: 26, opacity: 0.9 },
});
