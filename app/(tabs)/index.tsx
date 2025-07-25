import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';


const Building = ({ type, style }: { type: string, style: any }) => {
  // For now, we'll use a colored square that looks like an isometric building
  // You can replace this with your actual Midjourney assets later
  const buildingStyles = {
    house: { backgroundColor: '#8B4513', borderTopColor: '#CD853F' },
    office: { backgroundColor: '#4682B4', borderTopColor: '#87CEEB' },
    tower: { backgroundColor: '#2F4F4F', borderTopColor: '#708090' },
  };
  return (
    <View style={[styles.buildingBase, buildingStyles[type as keyof typeof buildingStyles], style]}>
      <View style={[styles.buildingTop, { backgroundColor: buildingStyles[type as keyof typeof buildingStyles].borderTopColor }]} />
    </View>
  );
};

export default function App() {
  const [seconds, setSeconds] = useState(0.2 * 60); // 25 minutes
  const [isRunning, setIsRunning] = useState(false);
  const [buildings, setBuildings] = useState<{ id: number; type: string }[]>([]);

  useEffect(() => {
    let interval: number;
    if (isRunning && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsRunning(false);
      // Timer completed! This is where we'll add building later
      setBuildings(prev => [...prev, { id: Date.now(), type: "house" }]);
      setSeconds(5); // Reset to 5 seconds for testing
    }
    return () => clearInterval(interval);
  }, [isRunning, seconds]);

  const startTimer = () => {
    setIsRunning(!isRunning); // Toggle start/pause
  };
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timer}>{formatTime(seconds)}</Text>
      {/* Simple city display */}
      <View style={styles.city}>
        <Text style={styles.cityTitle}>Your City: {buildings.length} buildings</Text>
        <View style={styles.buildingsGrid}>
          {buildings.map(building => (
            <Building key={building.id} type={building.type} style={{}} />
          ))}
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={startTimer}>
        <Text style={styles.buttonText}>
          {isRunning ? 'Pause' : 'Start Focus'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  city: {
    marginVertical: 30,
    alignItems: 'center',
  },
  cityTitle: {
    color: 'white',
    fontSize: 16,
    marginBottom: 10,
  },
  buildingsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  building: {
    fontSize: 30,
    margin: 5,
  },
  buildingBase: {
    width: 40,
    height: 40,
    margin: 2,
    position: 'relative',
  },
  buildingTop: {
    width: 40,
    height: 8,
    position: 'absolute',
    top: -4,
    transform: [{ skewX: '45deg' }],
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
  },
  timer: {
    fontSize: 48,
    color: 'white',
    marginBottom: 40,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});