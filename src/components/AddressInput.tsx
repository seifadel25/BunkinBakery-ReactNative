import Colors from "@/constants/Colors";
import React from "react";
import { TextInput, StyleSheet } from "react-native";
interface AddressInputProps {
  streetBuilding: {
    streetNumber: string;
    buildingNumber: string;
  };
  setStreetBuilding: (building: {
    streetNumber: string;
    buildingNumber: string;
  }) => void;
}
const AddressInput: React.FC<AddressInputProps> = ({
  streetBuilding,
  setStreetBuilding,
}) => (
  <>
    <TextInput
      placeholder="Street Number"
      value={streetBuilding.streetNumber}
      onChangeText={(text) =>
        setStreetBuilding({ ...streetBuilding, streetNumber: text })
      }
      style={styles.addressInput}
    />
    <TextInput
      placeholder="Building Number"
      style={styles.addressInput}
      value={streetBuilding.buildingNumber}
      onChangeText={(text) =>
        setStreetBuilding({ ...streetBuilding, buildingNumber: text })
      }
    />
  </>
);

const styles = StyleSheet.create({
  addressInput: {
    width: 300,
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 20,
    borderColor: Colors.light.Sec,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 20,
  },
});

export default AddressInput;
