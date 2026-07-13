import { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, TextProps, View } from 'react-native';

import { font, palette } from '@/constants/theme';

/** Letterspaced uppercase label, e.g. "PÅ KVÆRNEN", "NYHEDER". */
export function Eyebrow({
  children,
  gold,
  style,
}: {
  children: ReactNode;
  gold?: boolean;
  style?: TextProps['style'];
}) {
  return (
    <Text style={[styles.eyebrow, { color: gold ? palette.gold : palette.textDim }, style]}>
      {children}
    </Text>
  );
}

/** Serif display text (Fraunces) — screen titles and coffee names. */
export function Serif({ children, style, ...rest }: TextProps & { children: ReactNode }) {
  return (
    <Text style={[styles.serif, style]} {...rest}>
      {children}
    </Text>
  );
}

/** Full-screen scroll container with the standard screen padding. */
export function Screen({ children }: { children: ReactNode }) {
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  );
}

export function Hairline({ top }: { top?: boolean }) {
  return <View style={top ? styles.hairlineTop : styles.hairline} />;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.bg },
  content: { paddingTop: 76, paddingHorizontal: 20, paddingBottom: 120 },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 1.7,
    textTransform: 'uppercase',
    fontFamily: font.sansMedium,
  },
  serif: {
    fontFamily: font.serifMedium,
    color: palette.text,
    letterSpacing: -0.3,
  },
  hairline: { height: 1, backgroundColor: palette.hairline },
  hairlineTop: { height: 1, backgroundColor: palette.hairline },
});
