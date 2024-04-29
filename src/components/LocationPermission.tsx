import React, { useEffect, useState } from "react";
import * as Location from "expo-location";
import { LocationObject } from "expo-location";

interface LocationPermissionsProps {
  setLocation: (location: LocationObject) => void;
  setMapRegion: (region: any) => void; // Specify a more specific type if possible
  setMarkerLocation: (location: any) => void; // Specify a more specific type if possible
}
export const LocationPermissions: React.FC<LocationPermissionsProps> = ({
  setLocation,
  setMapRegion,
  setMarkerLocation,
}) => {
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
        return;
      }
      let currentLocation = await Location.getCurrentPositionAsync({});
      const initialRegion = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      setLocation(currentLocation);
      setMapRegion(initialRegion);
      setMarkerLocation(initialRegion);
    })();
  }, []);

  return null; // This component doesn't render anything itself
};
