// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Button,
//   StyleSheet,
//   TextInput,
//   Alert,
// } from "react-native";
// import DateTimePicker, {
//   DateTimePickerEvent,
// } from "@react-native-community/datetimepicker";
// import MapView, { Marker } from "react-native-maps";
// import * as Location from "expo-location";
// import { LocationObject } from "expo-location";
// import { CheckBox } from "react-native-elements";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { router } from "expo-router";
// import Colors from "@/constants/Colors";

// function DeliveryOptionsScreen() {
//   const [selectedOption, setSelectedOption] = useState("");
//   //schedule
//   const [date, setDate] = useState(new Date());
//   const [mode, setMode] = useState<"date" | "time">("date");
//   const [show, setShow] = useState(false);
//   const [checked, setChecked] = useState(false);
//   //map
//   const [location, setLocation] = useState({});
//   const [markerLocation, setMarkerLocation] = useState({
//     latitude: 0,
//     longitude: 0,
//     latitudeDelta: 0,
//     longitudeDelta: 0,
//   });
//   const [mapRegion, setMapRegion] = useState({
//     latitude: 0,
//     longitude: 0,
//     latitudeDelta: 0,
//     longitudeDelta: 0,
//   });
//   const [address, setAddress] = useState("");
//   const [streetBuilding, setStreetBuilding] = useState({
//     streetNumber: "",
//     buildingNumber: "",
//   });
//   useEffect(() => {
//     (async () => {
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") {
//         alert("Permission to access location was denied");
//         return;
//       }

//       let currentLocation = await Location.getCurrentPositionAsync({});
//       const initialRegion = {
//         latitude: currentLocation.coords.latitude,
//         longitude: currentLocation.coords.longitude,
//         latitudeDelta: 0.0922,
//         longitudeDelta: 0.0421,
//       };
//       setLocation(currentLocation);
//       setMapRegion(initialRegion);
//       setMarkerLocation(initialRegion);
//     })();
//   }, []);
//   const handleMapRegionChange = (region: any) => {
//     setMapRegion(region);
//   };
//   const handleMapPress = (event: any) => {
//     const { latitude, longitude } = event.nativeEvent.coordinate;
//     setMarkerLocation({
//       latitude,
//       longitude,
//       latitudeDelta: 0.0922,
//       longitudeDelta: 0.0421,
//     });
//   };

//   const handleConfirmLocation = async () => {
//     if (!mapRegion) {
//       alert("No location selected");
//       return;
//     }
//     if (!streetBuilding.streetNumber || !streetBuilding.buildingNumber) {
//       alert("Please enter street number and building number");
//       return;
//     }
//     let result = await Location.reverseGeocodeAsync({
//       latitude: mapRegion.latitude,
//       longitude: mapRegion.longitude,
//     });

//     if (result.length > 0) {
//       console.log(result);
//       console.log(mapRegion);
//       setAddress(
//         `${streetBuilding.buildingNumber},${streetBuilding.streetNumber},${result[0].street}, ${result[0].city}, ${result[0].region}, ${result[0].country},`
//       );
//       setShowMap(false);
//     } else {
//       alert("No address found for this location");
//     }
//   };

//   const onChange = (event: DateTimePickerEvent, selectedDate: any) => {
//     const currentDate = selectedDate;
//     if (currentDate === undefined || currentDate < new Date()) {
//       setShow(false);
//       return Alert.alert("Invalid Date");
//     }
//     setShow(false);
//     setDate(currentDate);
//   };

//   const showMode = (currentMode: any) => {
//     setShow(true);
//     setMode(currentMode);
//   };

//   const showDatepicker = () => {
//     showMode("date");
//   };

//   const showTimepicker = () => {
//     showMode("time");
//   };

//   const handleSelectOption = (option: any) => {
//     setSelectedOption(option);
//     setShowMap(true);
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>
//         {selectedOption === "delivery" && "Home Location:"}
//         {selectedOption === "pickup" && "Pickup from store"}
//         {selectedOption === "" && "Choose Delivery Option"}
//       </Text>
//       {selectedOption === "delivery" && (
//         <View>
//           <Text style={styles.address}>{address}</Text>

//           <TextInput
//             placeholder="Street Number"
//             value={streetBuilding.streetNumber}
//             onChangeText={(text) =>
//               setStreetBuilding({ ...streetBuilding, streetNumber: text })
//             }
//             style={styles.addressInput}
//           />
//           <TextInput
//             placeholder="Building Number"
//             style={styles.addressInput}
//             value={streetBuilding.buildingNumber}
//             onChangeText={(text) =>
//               setStreetBuilding({ ...streetBuilding, buildingNumber: text })
//             }
//           />
//         </View>
//       )}

//       <TouchableOpacity
//         style={[styles.card, selectedOption === "delivery" && styles.selected]}
//         onPress={() => handleSelectOption("delivery")}
//       >
//         <Text style={styles.cardText}>Home Delivery</Text>
//         {selectedOption === "delivery" && <Text style={styles.bullet}>•</Text>}
//       </TouchableOpacity>
//       {selectedOption === "delivery" && showMap && (
//         <>
//           <MapView
//             style={styles.map}
//             region={mapRegion}
//             onPress={handleMapPress}
//             onRegionChangeComplete={(region) => setMapRegion(region)}
//           >
//             {markerLocation && (
//               <Marker
//                 coordinate={markerLocation}
//                 draggable
//                 onDragEnd={(e) => setMarkerLocation(e.nativeEvent.coordinate)}
//               />
//             )}
//           </MapView>
//           <Button title="Confirm Location" onPress={handleConfirmLocation} />
//         </>
//       )}
//       <TouchableOpacity
//         style={[styles.card, selectedOption === "pickup" && styles.selected]}
//         onPress={() => handleSelectOption("pickup")}
//       >
//         <Text style={styles.cardText}>Pickup from Store</Text>
//         {selectedOption === "pickup" && <Text style={styles.bullet}>•</Text>}
//       </TouchableOpacity>
//       <CheckBox
//         title={"Set a Delivery/Pickup Date"}
//         checked={checked}
//         style={styles.checkbox}
//         onPress={() => setChecked(!checked)}
//         checkedIcon="dot-circle-o"
//         uncheckedIcon="circle-o"
//         checkedColor={Colors.light.tint}
//         uncheckedColor={Colors.light.tint}
//       />
//       {checked && (
//         <SafeAreaView>
//           <Button onPress={showDatepicker} title="Show date picker!" />
//           <Button onPress={showTimepicker} title="Show time picker!" />
//           <Text>selected: {date.toLocaleString()}</Text>
//           {show && (
//             <DateTimePicker
//               testID="dateTimePicker"
//               value={date}
//               mode={mode}
//               is24Hour={true}
//               onChange={onChange}
//             />
//           )}
//         </SafeAreaView>
//       )}
//       <Button
//         title="Proceed to payment"
//         onPress={() => router.push("/payment")}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     padding: 20,
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 20,
//   },
//   address: {
//     fontSize: 18,
//     marginBottom: 20,
//   },
//   addressInput: {
//     width: 300,
//     fontSize: 16,
//     fontWeight: "500",
//     marginBottom: 20,
//     borderColor: Colors.light.Sec,
//     borderWidth: 1,
//     borderRadius: 10,
//     paddingHorizontal: 20,
//   },
//   map: {
//     width: "100%",
//     height: 300,
//   },

//   card: {
//     width: "90%",
//     padding: 20,
//     marginVertical: 10,
//     borderRadius: 8,
//     borderWidth: 1,
//     shadowColor: Colors.light.tint,
//     shadowOffset: { width: 10, height: 4 },
//     shadowRadius: 2,
//     borderColor: Colors.light.Sec,
//     backgroundColor: "#f9f9f9",
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
//   selected: {
//     backgroundColor: "#e0e0e0",
//   },
//   cardText: {
//     fontSize: 18,
//   },
//   bullet: {
//     fontSize: 24,
//     color: Colors.light.tint,
//   },
//   checkbox: {
//     marginVertical: 10,
//     backgroundColor: Colors.light.tint,
//   },
//   proceedButton: {
//     marginTop: 20,
//     backgroundColor: "blue",
//     padding: 10,
//     borderRadius: 5,
//   },
//   proceedButtonText: {
//     color: "white",
//     fontSize: 18,
//   },
// });

// export default DeliveryOptionsScreen;

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
  const { setDeliveryDetails, checkout } = useCart();

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
    console.log("Delivery Details", {
      type: selectedOption,
      location: address,
      date: date,
    });
    router.push("/test");
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
