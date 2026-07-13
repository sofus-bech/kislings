import { StyleSheet, Text, View } from 'react-native';

import { Screen, Serif } from '@/components/ui';
import { font, palette } from '@/constants/theme';
import { menus } from '@/data/content';

export default function Menukort() {
  return (
    <Screen>
      <Serif style={styles.title}>Menukort</Serif>
      <Text style={styles.sub}>vælg sprog — åbner som pdf</Text>

      <View>
        {menus.map((m) => (
          <View key={m.lang} style={styles.row}>
            <View>
              <Serif style={styles.lang}>{m.lang}</Serif>
              <Text style={styles.rowSub}>{m.sub}</Text>
            </View>
            <Text style={styles.arrow}>→</Text>
          </View>
        ))}
        <View style={styles.hairline} />
      </View>

      <Text style={styles.note}>
        fredagsmenu serveres fra 17.30.{'\n'}køkkenet lukker kl. 16.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 32, marginBottom: 8 },
  sub: { color: palette.textDim, fontFamily: font.sans, fontSize: 13, marginBottom: 28 },
  row: {
    borderTopWidth: 1,
    borderTopColor: palette.hairline,
    paddingVertical: 28,
    paddingHorizontal: 4,
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  lang: { fontSize: 28 },
  rowSub: { color: palette.textDim, fontFamily: font.sans, fontSize: 12, marginTop: 4 },
  arrow: { fontSize: 18, color: palette.textDim },
  hairline: { height: 1, backgroundColor: palette.hairline },
  note: { color: palette.textDim, fontFamily: font.sans, fontSize: 12, lineHeight: 19, marginTop: 32 },
});
