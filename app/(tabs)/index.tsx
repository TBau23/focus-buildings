import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';



export default function App() {
  const [seconds, setSeconds] = useState(0.2 * 60); // 25 minutes
  const [isRunning, setIsRunning] = useState(false);



  useEffect(() => {
    let interval: number;
    if (isRunning && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsRunning(false);
      // Timer completed! Add the selected building to persistent storage
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
      
      
      <TouchableOpacity style={styles.button} onPress={startTimer}>
        <Text style={styles.buttonText}>
          {isRunning ? 'Pause' : 'Start Focus'}
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
  },
  timer: {
    fontSize: 48,
    color: 'white',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  buildingSelector: {
    backgroundColor: '#3a3a3a',
    padding: 16,
    borderRadius: 12,
    marginBottom: 30,
    alignItems: 'center',
    minWidth: 200,
  },
  buildingSelectorLabel: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 8,
  },
  selectedBuildingDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  selectedBuildingImage: {
    width: 32,
    height: 32,
    marginRight: 8,
  },
  selectedBuildingName: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  changeBuildingText: {
    color: '#4CAF50',
    fontSize: 12,
  },
  city: {
    marginVertical: 20,
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
  buildingBase: {
    width: 40,
    height: 40,
    margin: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4a4a4a',
    borderRadius: 4,
  },
  buildingIcon: {
    fontSize: 24,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#3a3a3a',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  buildingOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  buildingOption: {
    backgroundColor: '#4a4a4a',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    width: '48%',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedBuildingOption: {
    borderColor: '#4CAF50',
    backgroundColor: '#4a5a4a',
  },
  buildingOptionImage: {
    width: 48,
    height: 48,
    marginBottom: 8,
  },
  buildingOptionName: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  buildingOptionCost: {
    color: '#aaa',
    fontSize: 12,
  },
  modalCloseButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});