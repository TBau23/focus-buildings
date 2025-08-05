// screens/CityScreen.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import IsometricGrid, { Building } from '@/components/IsometricGrid';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function CityScreen() {
  const [buildings, setBuildings] = useState<Building[]>([]);

  /* ------------------------------------------------------------------ */
  /*  Persist / load                                                    */
  /* ------------------------------------------------------------------ */
  const loadBuildings = async () => {
    try {
      const saved = await AsyncStorage.getItem('cityBuildings');
      if (saved) setBuildings(JSON.parse(saved));
    } catch (err) {
      console.error('loadBuildings:', err);
    }
  };

  useFocusEffect(React.useCallback(() => { loadBuildings(); }, []));

  /* ------------------------------------------------------------------ */
  /*  Demo fallback (remove once you have data)                         */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    if (buildings.length) return;
    setBuildings([
      {
        id: 1,
        gx: 6,
        gy: 6,
        wPx: 256,
        hPx: 320,
        src: require('@/assets/images/test-building.png'),
      },
    ]);
  }, []);

  /* ------------------------------------------------------------------ */
  /*  UI                                                                */
  /* ------------------------------------------------------------------ */
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Your City
      </ThemedText>

      <View style={styles.statsContainer}>
        <ThemedText style={styles.stats}>Buildings: {buildings.length}</ThemedText>
        <ThemedText style={styles.stats}>Coins: 250</ThemedText>
      </View>

      <View style={styles.boardWrapper}>
        <IsometricGrid buildings={buildings} showGrid={true} />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, backgroundColor: '#87CEEB' },
  title:     { textAlign: 'center', marginBottom: 20, fontSize: 28, fontWeight: 'bold' },

  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingHorizontal: 40,
    backgroundColor: 'rgba(255,255,255,0.9)',
    marginHorizontal: 20,
    borderRadius: 10,
    paddingVertical: 10,
  },
  stats: { fontSize: 18, fontWeight: '700', color: '#2E7D32' },

  boardWrapper: { flex: 1 }, // takes remaining space
});
