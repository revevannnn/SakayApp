import React, { useRef, useEffect } from 'react';
import MapView, { Marker, Region, Polyline } from 'react-native-maps';
import { View, Text } from 'react-native';
import markers from '../context/markers';
import mainscreen from '../styles/MainScreenStyles';
import MapOverlay from '../components/MapOverlay';
import type { Location } from '../screens/LocationSearchScreen';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';

type MainScreenParams = {
  MainScreen: {   // ✅ FIXED: must match the actual navigation name
    origin?: Location;
    destination?: Location;
  };
};

type RouteLeg = {
  coordinates: { latitude: number; longitude: number }[];
  jeepCode: string;
};

export default function MainScreen() {
  const mapRef = useRef<MapView>(null);
  const route = useRoute<RouteProp<MainScreenParams, 'MainScreen'>>(); // ✅ Matches navigation name
  const origin = route.params?.origin;
  const destination = route.params?.destination;

  const routesMap: Record<string, Record<string, RouteLeg[]>> = {
    'Carmen Market': {
      'Gaisano City': [
        {
          coordinates: [
            { latitude: 8.480246, longitude: 124.637149 },
            { latitude: 8.48133, longitude: 124.63748 },
            { latitude: 8.481129, longitude: 124.63813 },
            { latitude: 8.484699, longitude: 124.638521 },
            { latitude: 8.488946, longitude: 124.639672 },
            { latitude: 8.486114, longitude: 124.649681 },
          ],
          jeepCode: 'C1',
        },
      ],
    },
    'Limketkai Mall': {
      'Gaisano City': [
        {
          coordinates: [
            { latitude: 8.481602, longitude: 124.657559 },
            { latitude: 8.483128, longitude: 124.657436 },
            { latitude: 8.483862, longitude: 124.65691 },
            { latitude: 8.484556, longitude: 124.656956 },
            { latitude: 8.486171, longitude: 124.649971 },
          ],
          jeepCode: 'L1',
        },
      ],
      'Carmen Market': [
        {
          coordinates: [
            { latitude: 8.481602, longitude: 124.657559 },
            { latitude: 8.480658, longitude: 124.657608 },
            { latitude: 8.479817, longitude: 124.656272 },
            { latitude: 8.478244, longitude: 124.655781 },
            { latitude: 8.478643, longitude: 124.653715 },
            { latitude: 8.476786, longitude: 124.653516 },
            { latitude: 8.476879, longitude: 124.652202 },
            { latitude: 8.477747, longitude: 124.652301 },
            { latitude: 8.477878, longitude: 124.650882 },
            { latitude: 8.477065, longitude: 124.65075 },
            { latitude: 8.477439, longitude: 124.649601 },
          ],
          jeepCode: 'L2',
        },
        {
          coordinates: [
            { latitude: 8.477439, longitude: 124.649601 },
            { latitude: 8.478804, longitude: 124.645376 },
            { latitude: 8.477917, longitude: 124.645201 },
            { latitude: 8.478435, longitude: 124.643133 },
            { latitude: 8.475932, longitude: 124.64246 },
            { latitude: 8.476611, longitude: 124.637836 },
            { latitude: 8.479164, longitude: 124.637853 },
            { latitude: 8.479289, longitude: 124.637036 },
            { latitude: 8.480246, longitude: 124.637149 },
          ],
          jeepCode: 'L3',
        },
      ],
    },
  };

  const routeData =
    origin && destination && routesMap[origin.name]?.[destination.name]
      ? routesMap[origin.name][destination.name]
      : [];

  const allCoordinates = routeData.flatMap((leg) => leg.coordinates);
  const legColors = ['purple', 'green', 'orange'];

  useEffect(() => {
    if (mapRef.current && allCoordinates.length > 0) {
      mapRef.current.fitToCoordinates(allCoordinates, {
        edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
        animated: true,
      });
    } else if (origin && mapRef.current) {
      const region: Region = {
        latitude: origin.coordinates.latitude,
        longitude: origin.coordinates.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      mapRef.current.animateToRegion(region, 1000);
    }
  }, [origin, destination]);

  return (
    <View style={mainscreen.container}>
      <MapView ref={mapRef} style={mainscreen.map} initialRegion={markers[0].coordinates}>
        {/* Origin marker */}
        {origin && (
          <Marker
            coordinate={origin.coordinates}
            title="Origin"
            description={origin.name}
            pinColor="blue"
          />
        )}

        {/* Destination marker */}
        {destination && (
          <Marker
            coordinate={destination.coordinates}
            title="Destination"
            description={destination.name}
            pinColor="orange"
          />
        )}

        {/* Render polylines with jeepney icons */}
        {routeData.map((leg, index) => (
          <React.Fragment key={`leg-${index}`}>
            <Polyline
              coordinates={leg.coordinates}
              strokeColor={legColors[index] || 'purple'}
              strokeWidth={3}
            />
            {leg.coordinates.length > 0 && (
              <Marker
                coordinate={leg.coordinates[Math.floor(leg.coordinates.length / 2)]}
                anchor={{ x: 0.5, y: 0.5 }}
              >
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ color: legColors[index] || 'purple', fontSize: 18 }}>🚐</Text>
                  <Text style={{ color: legColors[index] || 'purple', fontSize: 12 }}>
                    {leg.jeepCode}
                  </Text>
                </View>
              </Marker>
            )}
          </React.Fragment>
        ))}
      </MapView>

      <MapOverlay origin={origin} destination={destination} />
    </View>
  );
}
