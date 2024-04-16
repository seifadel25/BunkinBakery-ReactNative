import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import React from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import products from "@assets/data/products";
import { useState } from "react";
import Button from "@/components/Button";

const sizes = ["S", "M", "L", "XL"];

const product = () => {
  const { id } = useLocalSearchParams();

  const [selectedSize, setSelectedSize] = useState("L");

  const product = products.find((p) => p.id.toString() === id);

  if (!product) {
    return <Text>product not found</Text>;
  }

  const addToCart = () => {
    console.log("added to cart " + product.name + " size: " + selectedSize);
  };

  return (
    <View>
      <Stack.Screen options={{ title: product.name }} />
      <View style={styles.container}>
        <Image source={{ uri: product.image }} style={styles.img} />

        <Text>Select Size</Text>
        <View style={styles.sizes}>
          {sizes.map((size) => (
            <Pressable
              onPress={() => setSelectedSize(size)}
              key={size}
              style={[
                styles.size,
                {
                  backgroundColor:
                    selectedSize === size ? "gainsboro" : "white",
                },
              ]}
            >
              <Text
                style={[
                  styles.sizeText,
                  { color: selectedSize === size ? "black" : "gray" },
                ]}
              >
                {size}
              </Text>
            </Pressable>
          ))}
        </View>
        <Text style={styles.price}>{(product.price * 10).toFixed(2)} EGP</Text>
        <Button text="Add to Cart" onPress={addToCart} />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    flex: 1,
  },
  // title: {
  //   fontSize: 20,
  //   fontWeight: "600",
  //   marginVertical: 10,
  // },
  price: {
    fontSize: 18,
    color: "teal",
    fontWeight: "700",
  },
  img: {
    width: "100%",
    aspectRatio: 1,
    resizeMode: "contain",
  },
  sizes: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
    width: "70%",
    marginHorizontal: "auto",
  },
  size: {
    backgroundColor: "lightgrey",
    width: 50,
    aspectRatio: 1,
    padding: 10,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  sizeText: {
    fontSize: 20,
    fontWeight: "500",
  },
});
export default product;
