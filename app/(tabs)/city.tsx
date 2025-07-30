import React from 'react';
import { StyleSheet, View, ScrollView, Image } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

const GRID_SIZE = 8;
const TILE_SIZE = 64; // Square tile size before isometric transformation

interface Building {
  id: number;
  type: string;
  x: number;
  y: number;
}

const IsometricBuilding = ({ type, x, y }: { type: string, x: number, y: number }) => {
  // Standard isometric projection math
  const tileWidth = 64;
  const tileHeight = 32;
  
  const screenX = (x - y) * (tileWidth / 2);
  const screenY = (x + y) * (tileHeight / 2);

  return (
    <View style={[
      styles.buildingContainer,
      {
        left: screenX,
        top: screenY,
        zIndex: x + y, // Proper depth sorting
      }
    ]}>
      <Image 
        source={require('@/assets/images/test-building.png')}
        style={styles.buildingImage}
        resizeMode="contain"
      />
    </View>
  );
};

const IsometricGrid = () => {
  // Simple clean background - no visible grid lines
  return (
    <View style={styles.gridBackground} />
  );
};

export default function CityScreen() {
  // Mock buildings data - this will come from state management later
  const buildings: Building[] = [
    { id: 1, type: 'cathedral', x: 2, y: 2 },
    { id: 2, type: 'cathedral', x: 4, y: 1 },
    { id: 3, type: 'cathedral', x: 1, y: 4 },
  ];

  const renderGrid = () => {
    return <IsometricGrid />;
  };

  const renderBuildings = () => {
    return buildings.map(building => (
      <IsometricBuilding
        key={building.id}
        type={building.type}
        x={building.x}
        y={building.y}
      />
    ));
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Your City</ThemedText>
      <View style={styles.statsContainer}>
        <ThemedText style={styles.stats}>Buildings: {buildings.length}</ThemedText>
        <ThemedText style={styles.stats}>Coins: 250</ThemedText>
      </View>
      
      <ScrollView 
        style={styles.cityContainer}
        contentContainerStyle={styles.cityContent}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        minimumZoomScale={0.5}
        maximumZoomScale={2.0}
        zoomEnabled={true}
      >
        <View style={styles.cityView}>
          {renderGrid()}
          {renderBuildings()}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    backgroundColor: '#87CEEB', // Sky blue background
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 28,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingHorizontal: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    marginHorizontal: 20,
    borderRadius: 10,
    paddingVertical: 10,
  },
  stats: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E7D32',
  },
  cityContainer: {
    flex: 1,
  },
  cityContent: {
    alignItems: 'center',
    paddingVertical: 100,
    minHeight: 600,
  },
  cityView: {
    position: 'relative',
    width: 600,
    height: 600,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridBackground: {
    position: 'absolute',
    width: 600,
    height: 600,
    backgroundColor: 'transparent', // Invisible grid background
  },
  buildingContainer: {
    position: 'absolute',
    left: 300, // Center buildings in the view
    top: 200,
  },
  buildingImage: {
    width: 120,
    height: 120,
  },
});