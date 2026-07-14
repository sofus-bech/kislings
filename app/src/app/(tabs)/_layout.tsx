import { Tabs } from 'expo-router';

import { KislingsTabBar } from '@/components/tab-bar';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <KislingsTabBar {...props} />}>
      <Tabs.Screen name="index" options={{ title: 'Hjem' }} />
      <Tabs.Screen name="kort" options={{ title: 'Kort' }} />
      <Tabs.Screen name="kaffen" options={{ title: 'Kaffen' }} />
      <Tabs.Screen name="menukort" options={{ title: 'Menukort' }} />
      <Tabs.Screen name="info" options={{ title: 'Info' }} />
      <Tabs.Screen name="profil" options={{ title: 'Profil' }} />
    </Tabs>
  );
}
