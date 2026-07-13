import { StyleSheet, View } from 'react-native';

import { palette } from '@/constants/theme';

// Small per-stamp variation so the ring looks hand-pressed rather than printed.
const ROTATIONS = [8, -12, 20, -5, 14, -18, 3, -9, 16, 0];

type Props = {
  size: number;
  filled: boolean;
  /** the last empty cell — the "free" one: dashed gold + soft glow */
  free?: boolean;
  index?: number;
};

/**
 * The signature coffee-ring stamp. Filled = gold ring with a faint inner ring,
 * slightly rotated. Empty = hairline circle. Free = dashed gold + glow.
 * See design/README.md "signature element".
 */
export function Stamp({ size, filled, free = false, index = 0 }: Props) {
  const rot = ROTATIONS[index % ROTATIONS.length];

  if (filled) {
    return (
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 3,
          borderColor: palette.gold,
          opacity: 0.92,
          transform: [{ rotate: `${rot}deg` }],
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            width: size - 9,
            height: size - 9,
            borderRadius: (size - 9) / 2,
            borderWidth: 1.5,
            borderColor: 'rgba(200,162,104,0.30)',
          }}
        />
      </View>
    );
  }

  if (free) {
    return (
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 1,
          borderStyle: 'dashed',
          borderColor: 'rgba(200,162,104,0.55)',
          shadowColor: palette.gold,
          shadowOpacity: 0.22,
          shadowRadius: 14,
          shadowOffset: { width: 0, height: 0 },
        }}
      />
    );
  }

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 1,
        borderColor: palette.hairline,
      }}
    />
  );
}

// Builds the fill/empty/free pattern for a stamp track.
export function stampCells(count: number, total: number) {
  return Array.from({ length: total }, (_, i) => {
    const filled = i < count;
    return { filled, free: !filled && i === total - 1, index: i };
  });
}

export const stampStyles = StyleSheet.create({
  rowWrap: { flexDirection: 'row', flexWrap: 'wrap' },
});
