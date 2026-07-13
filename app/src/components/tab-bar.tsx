import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { font, palette } from '@/constants/theme';

function TabIcon({ name, color }: { name: string; color: string }) {
  const common = {
    stroke: color,
    strokeWidth: 1.5,
    fill: 'none',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  return (
    <Svg width={23} height={23} viewBox="0 0 24 24">
      {name === 'index' && (
        <>
          <Path d="M3 11l9-8 9 8" {...common} />
          <Path d="M5.5 9.5V20h13V9.5" {...common} />
        </>
      )}
      {name === 'kort' && (
        <>
          <Rect x={2.5} y={5} width={19} height={14} rx={2.5} {...common} />
          <Path d="M2.5 9.5h19" {...common} />
        </>
      )}
      {name === 'kaffen' && (
        <>
          <Path d="M4 8h13v5a5 5 0 01-5 5H9a5 5 0 01-5-5V8z" {...common} />
          <Path d="M17 9.5h1.5a2.5 2.5 0 010 5H17" {...common} />
        </>
      )}
      {name === 'menukort' && (
        <>
          <Path d="M4 6h16" {...common} />
          <Path d="M4 12h16" {...common} />
          <Path d="M4 18h10" {...common} />
        </>
      )}
      {name === 'info' && (
        <>
          <Circle cx={12} cy={12} r={9} {...common} />
          <Path d="M12 11v5" {...common} />
          <Path d="M12 8v.01" {...common} />
        </>
      )}
    </Svg>
  );
}

export function KislingsTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { paddingBottom: insets.bottom + 10 }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = (options.title ?? route.name) as string;
        const focused = state.index === index;
        const color = focused ? palette.gold : palette.textDim;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        return (
          <Pressable key={route.key} onPress={onPress} style={styles.tab}>
            <TabIcon name={route.name} color={color} />
            <Text style={[styles.label, { color }]}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(13,12,11,0.96)',
    borderTopWidth: 1,
    borderTopColor: palette.hairline,
    paddingTop: 10,
    paddingHorizontal: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 5,
    paddingTop: 2,
  },
  label: {
    fontSize: 10,
    fontFamily: font.sansMedium,
  },
});
