import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import products from "@assets/data/products";
import { useState } from "react";
import Button from "@/components/Button";
import Colors from "@/constants/Colors";
import { useCart } from "@/providers/CartProvider";
import { PizzaSize } from "@/types";
import { FontAwesome } from "@expo/vector-icons";
import { useProduct } from "@/api/products";
import { defaultPizzaImg } from "@/components/ProductsList";
import RemoteImage from "@/components/RemoteImage";

const product = () => {
  const { id: idString } = useLocalSearchParams();
  const id = parseInt(typeof idString === "string" ? idString : idString[0]);
  const { data: product, error, isLoading } = useProduct(id);

  const isUpdating = !!id;

  const router = useRouter();

  if (!product) {
    return <Text>product not found</Text>;
  }

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return (
      <Text style={styles.container}>
        Failed to fetch Products : {error.message}
      </Text>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Menu",
          headerRight: () => (
            <Link href={`/(admin)/menu/create?id=${id}`} asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="pencil"
                    size={25}
                    color={Colors.light.tabIconDefault}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Stack.Screen options={{ title: product.name }} />
      <View style={styles.main}>
        <RemoteImage
          path={product.image}
          fallback={defaultPizzaImg}
          style={styles.img}
        />
      </View>

      <View style={styles.end}>
        {/* <Text style={styles.price}>{(product.price * 10).toFixed(2)} EGP</Text> */}
        <Text style={styles.price}>{product.price} EGP</Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 20,
    flex: 1,
    flexDirection: "column",
  },
  main: { flex: 3 },
  end: {
    // marginTop: "30%",
    flex: 1,
    justifyContent: "flex-end",
  },
  price: {
    fontSize: 18,
    color: Colors.light.tabIconDefault,
    fontWeight: "700",
  },
  img: {
    width: "100%",
    aspectRatio: 1,
    resizeMode: "contain",
  },
});
export default product;
