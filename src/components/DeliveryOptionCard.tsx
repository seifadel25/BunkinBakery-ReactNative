import Colors from "@/constants/Colors";
import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface DeliveryOptionCardProps {
  option: string;
  selectedOption: string;
  handleSelectOption: (option: string) => void;
  text: string;
}
const DeliveryOptionCard: React.FC<DeliveryOptionCardProps> = ({
  option,
  selectedOption,
  handleSelectOption,
  text,
}) => (
  <TouchableOpacity
    style={[styles.card, selectedOption === option && styles.selected]}
    onPress={() => handleSelectOption(option)}
  >
    <Text style={styles.cardText}>{text}</Text>
    {selectedOption === option && <Text style={styles.bullet}>•</Text>}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    width: "90%",
    padding: 20,
    marginVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "gray",
    backgroundColor: "#f9f9f9",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selected: {
    backgroundColor: "#e0e0e0",
    borderWidth: 2,
    borderColor: Colors.light.tint,

  },
  cardText: {
    fontSize: 18,
  },
  bullet: {
    fontSize: 24,
    color: Colors.light.tint,
  },
});

export default DeliveryOptionCard;
