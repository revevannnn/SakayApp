import { TouchableOpacity, View, Text } from 'react-native';
import mapOverlayStyles from '../styles/MapOverlayStyles';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList, Location } from '../context/navigationTypes';

type Props = {
  origin?: Location;
  destination?: Location;
};

export default function MapOverlay({ origin, destination }: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View pointerEvents="box-none" style={mapOverlayStyles.container}>
      {/* 🔹 Bottom panel with selection buttons */}
      <View pointerEvents="auto" style={mapOverlayStyles.lowerviewstyle}>
        <Text style={mapOverlayStyles.header}>Where to?</Text>

        {/* ✅ Origin selector — keeps both origin and destination in params */}
        <TouchableOpacity
          style={mapOverlayStyles.originAndDestinationContainer}
          onPress={() =>
            navigation.navigate('LocationSearch', {
              type: 'origin',
              origin,
              destination,
            })
          }
        >
          <View style={mapOverlayStyles.originAndDestination}>
            <Ionicons name="map-outline" size={24} color="blue" />
            <Text style={mapOverlayStyles.subheader}>Origin</Text>
          </View>
          <Text style={mapOverlayStyles.originAndDestinationText}>
            {origin ? origin.name : 'Tap to select origin'}
          </Text>
        </TouchableOpacity>

        {/* ✅ Destination selector — also preserves both params */}
        <TouchableOpacity
          style={mapOverlayStyles.originAndDestinationContainer}
          onPress={() =>
            navigation.navigate('LocationSearch', {
              type: 'destination',
              origin,
              destination,
            })
          }
        >
          <View style={mapOverlayStyles.originAndDestination}>
            <Ionicons name="navigate-outline" size={24} color="orange" />
            <Text style={mapOverlayStyles.subheader}>Destination</Text>
          </View>
          <Text style={mapOverlayStyles.originAndDestinationText}>
            {destination ? destination.name : 'Tap to select destination'}
          </Text>
        </TouchableOpacity>

        {/* 🔹 Buttons to show route lists */}
        <View style={mapOverlayStyles.buttonRow}>
          <TouchableOpacity
            style={mapOverlayStyles.button}
            onPress={() => navigation.navigate('RouteList', { mode: 'jeepney' })}
          >
            <Text style={mapOverlayStyles.buttonText}>See Jeepney Routes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={mapOverlayStyles.button}
            onPress={() => navigation.navigate('RouteList', { mode: 'tricycle' })}
          >
            <Text style={mapOverlayStyles.buttonText}>See Tricycle Routes</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
