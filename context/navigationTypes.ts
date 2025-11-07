export type Location = {
  id: string;
  name: string;
  coordinates: { latitude: number; longitude: number };
};

export type RootStackParamList = {
  MainScreen: { origin?: Location; destination?: Location };
  LocationSearch: {
    type: 'origin' | 'destination';
    origin?: Location;
    destination?: Location;
  };
  RouteList: { mode: string };
  RouteMap: { routeId: string };
};
