import { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


interface BuildingType {
  id: string;
  name: string;
  asset: any;
  cost: number;
  description: string;
}

const BUILDING_TYPES: BuildingType[] = [
  {
    id: 'cathedral',
    name: 'Cathedral',
    asset: require('@/assets/images/test-building.png'),
    cost: 10,
    description: 'A grand cathedral for your city'
  },
  // TODO: Add more building types when we have more assets
  // {
  //   id: 'house',
  //   name: 'House',
  //   asset: require('@/assets/images/house.png'),
  //   cost: 5,
  //   description: 'A cozy residential building'
  // },
];


const BuildingSelectionModal = ({ 
  visible, 
  onClose, 
  onSelect, 
  selectedBuilding 
}: { 
  visible: boolean;
  onClose: () => void;
  onSelect: (building: BuildingType) => void;
  selectedBuilding: BuildingType;
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Building Reward</Text>
          
          <View style={styles.buildingOptions}>
            {BUILDING_TYPES.map((building) => (
              <TouchableOpacity
                key={building.id}
                style={[
                  styles.buildingOption,
                  selectedBuilding.id === building.id && styles.selectedBuildingOption
                ]}
                onPress={() => onSelect(building)}
              >
                <Image 
                  source={building.asset}
                  style={styles.buildingOptionImage}
                  resizeMode="contain"
                />
                <Text style={styles.buildingOptionName}>{building.name}</Text>
                <Text style={styles.buildingOptionCost}>{building.cost} coins</Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
            <Text style={styles.modalCloseButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default function App() {
  const [seconds, setSeconds] = useState(0.2 * 60); // 25 minutes
  const [isRunning, setIsRunning] = useState(false);
  const [buildings, setBuildings] = useState<{ id: number; type: string }[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingType>(BUILDING_TYPES[0]);
  const [showBuildingModal, setShowBuildingModal] = useState(false);

  useEffect(() => {
    let interval: number;
    if (isRunning && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsRunning(false);
      // Timer completed! Add the selected building to persistent storage
      addBuildingToCity(selectedBuilding);
      setBuildings(prev => [...prev, { id: Date.now(), type: selectedBuilding.id }]);
      setSeconds(5); // Reset to 5 seconds for testing
    }
    return () => clearInterval(interval);
  }, [isRunning, seconds]);

  const addBuildingToCity = async (building: BuildingType) => {
    try {
      const existingBuildings = await AsyncStorage.getItem('cityBuildings');
      const buildings = existingBuildings ? JSON.parse(existingBuildings) : [];
      
      const newBuilding = {
        id: Date.now(),
        type: building.id,
        x: Math.floor(Math.random() * 6), // Random placement for now
        y: Math.floor(Math.random() * 6),
      };
      
      buildings.push(newBuilding);
      await AsyncStorage.setItem('cityBuildings', JSON.stringify(buildings));
    } catch (error) {
      console.error('Failed to save building to city:', error);
    }
  };

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
      
      {/* Building Selection */}
      <TouchableOpacity 
        style={styles.buildingSelector}
        onPress={() => setShowBuildingModal(true)}
      >
        <Text style={styles.buildingSelectorLabel}>Reward:</Text>
        <View style={styles.selectedBuildingDisplay}>
          <Image 
            source={selectedBuilding.asset}
            style={styles.selectedBuildingImage}
            resizeMode="contain"
          />
          <Text style={styles.selectedBuildingName}>{selectedBuilding.name}</Text>
        </View>
        <Text style={styles.changeBuildingText}>Tap to change</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={startTimer}>
        <Text style={styles.buttonText}>
          {isRunning ? 'Pause' : 'Start Focus'}
        </Text>
      </TouchableOpacity>

      <BuildingSelectionModal
        visible={showBuildingModal}
        onClose={() => setShowBuildingModal(false)}
        onSelect={(building) => {
          setSelectedBuilding(building);
          setShowBuildingModal(false);
        }}
        selectedBuilding={selectedBuilding}
      />
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