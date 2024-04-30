import React, { useState } from "react";
import {
  View,
  Button,
  StyleSheet,
  SafeAreaView,
  Pressable,
} from "react-native";
import { LocationPermissions } from "@components/LocationPermission";
import AddressInput from "@components/AddressInput";
import MapSelector from "@components/MapSelector";
import DateTimeSelector from "@components/DateTimeSelector";
import DeliveryOptionCard from "@components/DeliveryOptionCard";
import DeliveryOptionsHeader from "@components/DeliveryOptionsHeader";
import { CheckBox } from "react-native-elements";
import Colors from "@/constants/Colors";
import { router } from "expo-router";
import * as Location from "expo-location";
import Btn from "@/components/Button";
import { useCart } from "@/providers/CartProvider";
import { useInsertOrder } from "@/api/orders";

function DeliveryOptionsScreen() {
  const { setDeliveryDetails } = useCart();

  const [selectedOption, setSelectedOption] = useState("");
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState<"date" | "time">("date");
  const [show, setShow] = useState(false);
  const [showMap, setShowMap] = useState(true);

  const [checked, setChecked] = useState(false);
  const [location, setLocation] = useState({});
  const [markerLocation, setMarkerLocation] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0,
    longitudeDelta: 0,
  });
  const [mapRegion, setMapRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0,
    longitudeDelta: 0,
  });
  const [address, setAddress] = useState("Pickup From store");
  const [streetBuilding, setStreetBuilding] = useState({
    streetNumber: "",
    buildingNumber: "",
  });
  const handleConfirmLocation = async () => {
    if (!mapRegion) {
      alert("No location selected");
      return;
    }
    if (!streetBuilding.streetNumber || !streetBuilding.buildingNumber) {
      alert("Please enter street number and building number");
      return;
    }
    let result = await Location.reverseGeocodeAsync({
      latitude: mapRegion.latitude,
      longitude: mapRegion.longitude,
    });

    if (result.length > 0) {
      // console.log(result);
      // console.log(mapRegion);
      setAddress(
        `${streetBuilding.buildingNumber},${streetBuilding.streetNumber},${result[0].street}, ${result[0].city}, ${result[0].region}, ${result[0].country},`
      );

      setShowMap(false);
    } else {
      alert("No address found for this location");
    }
  };

  const goToPayment = () => {
    setAddress.toString();
    setDate.toString();
    setDeliveryDetails({
      type: selectedOption,
      location: address,
      date: date,
    });

    router.push("/pay");
  };

  return (
    <View style={styles.container}>
      <LocationPermissions
        setLocation={setLocation}
        setMapRegion={setMapRegion}
        setMarkerLocation={setMarkerLocation}
      />
      <DeliveryOptionsHeader
        selectedOption={selectedOption}
        location={address || ""}
      />
      <Pressable
        onPress={() => {
          setShowMap(true);
        }}
      >
        <DeliveryOptionCard
          option="delivery"
          selectedOption={selectedOption}
          handleSelectOption={setSelectedOption}
          text="Home Delivery"
        />
      </Pressable>
      {selectedOption === "delivery" && showMap && (
        <>
          <AddressInput
            streetBuilding={streetBuilding}
            setStreetBuilding={setStreetBuilding}
          />
          <MapSelector
            mapRegion={mapRegion}
            setMapRegion={setMapRegion}
            markerLocation={markerLocation}
            setMarkerLocation={setMarkerLocation}
          />
          <View style={styles.mapBtn}>
            <Button
              title="Confirm Location"
              color={Colors.light.tint}
              onPress={handleConfirmLocation}
            />
          </View>
        </>
      )}
      <Pressable
        onPress={() => {
          setShowMap(false);
        }}
      >
        <DeliveryOptionCard
          option="pickup"
          selectedOption={selectedOption}
          handleSelectOption={setSelectedOption}
          text="Pickup from Store"
        />
      </Pressable>
      <CheckBox
        title={"Set a Delivery/Pickup Date"}
        checked={checked}
        onPress={() => setChecked(!checked)}
        checkedIcon="dot-circle-o"
        uncheckedIcon="circle-o"
        checkedColor={Colors.light.tint}
        uncheckedColor={Colors.light.tint}
      />

      {checked && (
        <SafeAreaView>
          <DateTimeSelector
            show={show}
            setShow={setShow}
            date={date}
            setDate={setDate}
            mode={mode}
            setMode={setMode}
          />
        </SafeAreaView>
      )}
      <Pressable style={styles.btn}>
        <Btn width={"100%"} text="Proceed to payment" onPress={goToPayment} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  mapBtn: {
    marginTop: 10,
    marginBottom: 10,
  },
  btn: {
    flex: 1,
    justifyContent: "flex-end",
    width: "100%",
  },
});

export default DeliveryOptionsScreen;
