import React from "react";
import { Text, StyleSheet } from "react-native";

interface DeliveryOptionHeaderProps {
  selectedOption: string;
  location: string;
}

const DeliveryOptionsHeader: React.FC<DeliveryOptionHeaderProps> = ({
  selectedOption,
  location,
}) => (
  <Text style={styles.header}>
    {selectedOption === "delivery" && (
      <Text style={styles.address}>Home Location: {location}</Text>
    )}
    {selectedOption === "pickup" && "Pickup from store"}
    {selectedOption === "" && "Choose Delivery Option"}
  </Text>
);

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  address: {
    fontSize: 18,
    marginBottom: 20,
  },
});

export default DeliveryOptionsHeader;
