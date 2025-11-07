import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../context/navigationTypes';
import { Ionicons } from '@expo/vector-icons';
import locationSearchStyles from '../styles/LocationSearchStyles';

type Location = {
  id: string;
  name: string;
  coordinates: { latitude: number; longitude: number };
};

const MOCK_LOCATIONS: Location[] = [
  { id: 'loc-01', name: 'Limketkai Mall', coordinates: { latitude: 8.481602, longitude: 124.657559 } },
  { id: 'loc-02', name: 'Gaisano City', coordinates: { latitude: 8.486171, longitude: 124.649971 } },
  { id: 'loc-03', name: 'Carmen Market', coordinates: { latitude: 8.480246, longitude: 124.637149 } },
  { id: 'loc-04', name: 'Divisoria Terminal', coordinates: { latitude: 8.477125, longitude: 124.646046 } },
  { id: 'loc-05', name: 'Lapasan Highway', coordinates: { latitude: 8.482091, longitude: 124.667222 } },
];

export default function LocationSearchScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'LocationSearch'>>();
  const { type, origin, destination } = route.params;

  const [query, setQuery] = useState('');
  const [filteredLocations, setFilteredLocations] = useState<Location[]>(MOCK_LOCATIONS);

  // 🔍 Filter mock locations based on user input
  const handleSearch = (text: string) => {
    setQuery(text);
    const filtered = MOCK_LOCATIONS.filter((loc) =>
      loc.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredLocations(filtered);
  };

  // 📍 When user selects a location
  const handleSelectLocation = (location: Location) => {
    if (type === 'origin') {
      // Preserve destination
      navigation.navigate('MainScreen', { origin: location, destination });
    } else {
      // Preserve origin
      navigation.navigate('MainScreen', { origin, destination: location });
    }
  };

  return (
    <SafeAreaView style={locationSearchStyles.container}>
      {/* 🔙 Back button and header */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{ flexDirection: 'row', marginBottom: 20 }}
      >
        <Ionicons name="arrow-back" size={30} color="black" />
        <Text style={locationSearchStyles.header}>
          Select {type === 'origin' ? 'Origin' : 'Destination'}
        </Text>
      </TouchableOpacity>

      {/* 🔎 Search box */}
      <TextInput
        value={query}
        onChangeText={handleSearch}
        placeholder="Search location..."
        style={locationSearchStyles.input}
      />

      {/* 📋 Search results */}
      <FlatList
        data={filteredLocations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={locationSearchStyles.item}
            onPress={() => handleSelectLocation(item)}
          >
            <Text style={locationSearchStyles.itemText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}
