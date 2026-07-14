import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Eyebrow, Serif } from '@/components/ui';
import { font, palette } from '@/constants/theme';
import { useGuides } from '@/lib/live';

export default function GuideDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const guide = useGuides().find((g) => g.id === id);

  if (!guide) return <View style={styles.screen} />;

  const spec = [
    { label: 'RATIO', value: guide.ratio },
    { label: 'DOSIS', value: guide.dose },
    { label: 'VAND', value: guide.water },
    { label: 'TEMP', value: guide.temp },
  ];

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Pressable onPress={() => router.back()} style={styles.back} hitSlop={10}>
        <Text style={styles.backIcon}>←</Text>
      </Pressable>

      <Eyebrow style={styles.eyebrow}>BRYGGUIDE</Eyebrow>
      <Serif style={styles.title}>{guide.name}</Serif>

      <View style={styles.spec}>
        {spec.map((s, i) => (
          <View key={s.label} style={[styles.specCol, i > 0 && styles.specDivider]}>
            <Text style={styles.specLabel}>{s.label}</Text>
            <Serif style={styles.specValue}>{s.value || '—'}</Serif>
          </View>
        ))}
      </View>

      <View>
        {guide.steps.map((st) => (
          <View key={st.n} style={styles.stepRow}>
            <Serif style={styles.stepN}>{st.n}</Serif>
            <Text style={styles.stepText}>{st.text}</Text>
            {!!st.time && <Text style={styles.stepTime}>{st.time}</Text>}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.bg },
  content: { paddingTop: 70, paddingHorizontal: 22, paddingBottom: 110 },
  back: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.hairline,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },
  backIcon: { color: palette.text, fontSize: 16 },
  eyebrow: { marginBottom: 8 },
  title: { fontSize: 34, marginBottom: 24 },
  spec: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: palette.hairline,
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 8,
    marginBottom: 30,
  },
  specCol: { flex: 1, alignItems: 'center' },
  specDivider: { borderLeftWidth: 1, borderLeftColor: palette.hairline },
  specLabel: { color: palette.textDim, fontFamily: font.sansMedium, fontSize: 10, letterSpacing: 1.4, marginBottom: 6 },
  specValue: { fontSize: 17 },
  stepRow: {
    flexDirection: 'row',
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: palette.hairline,
    paddingVertical: 16,
    alignItems: 'baseline',
  },
  stepN: { color: palette.textDim, fontSize: 15, width: 20 },
  stepText: { flex: 1, color: palette.text, fontFamily: font.sans, fontSize: 14, lineHeight: 22 },
  stepTime: { color: palette.textDim, fontFamily: font.sans, fontSize: 12 },
});
