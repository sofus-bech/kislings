import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Serif } from '@/components/ui';
import { font, palette } from '@/constants/theme';
import { useNews } from '@/lib/live';

// Strip the rich-text body's HTML tags into readable paragraphs.
function toText(html: string): string {
  return html
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export default function NewsDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const item = useNews().find((n) => n.id === id);

  if (!item) return <View style={styles.screen} />;

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
        <Text style={styles.date}>{item.date}</Text>
        <Serif style={styles.title}>{item.title}</Serif>
        <Text style={styles.text}>{toText(item.body)}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.bg },
  content: { paddingBottom: 110 },
  hero: { height: 300, position: 'relative' },
  heroImg: { width: '100%', height: '100%', opacity: 0.5 },
  scrimTop: { position: 'absolute', top: 0, left: 0, right: 0, height: 120, backgroundColor: 'rgba(13,12,11,0.35)' },
  scrimBottom: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 150, backgroundColor: 'rgba(13,12,11,0.75)' },
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
  body: { paddingHorizontal: 22, marginTop: -30 },
  date: {
    color: palette.textDim,
    fontFamily: font.sansMedium,
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  title: { fontSize: 30, lineHeight: 35, marginBottom: 20 },
  text: { color: palette.text, fontFamily: font.sans, fontSize: 15, lineHeight: 26, opacity: 0.9 },
});
