import React from "react";
import MapView, { Marker } from "react-native-maps";
interface MapSelectorProps {
  mapRegion: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  setMapRegion: (region: any) => void;
  markerLocation: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  setMarkerLocation: (location: any) => void;
}
const MapSelector: React.FC<MapSelectorProps> = ({
  mapRegion,
  setMapRegion,
  markerLocation,
  setMarkerLocation,
}) => (
  <MapView
    style={{ width: "100%", height: 300 }}
    region={mapRegion}
    onPress={(event) => {
      const { latitude, longitude } = event.nativeEvent.coordinate;
      setMarkerLocation({
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }}
    onRegionChangeComplete={(region) => setMapRegion(region)}
    showsUserLocation={true} // Shows the user's location on the map
    showsMyLocationButton={true} // Shows the default GPS button to center the map on the user's location
  >
    {markerLocation && (
      <Marker
        coordinate={markerLocation}
        draggable
        onDragEnd={(e) => setMarkerLocation(e.nativeEvent.coordinate)}
      />
    )}
  </MapView>
);

export default MapSelector;
