import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import products from "@assets/data/products";
import ProductsList from "@components/ProductsList";
import { useProductList } from "@/api/products";
import { Text } from "react-native-elements";

export default function MenuScreen() {
  const { data: products, isLoading, error } = useProductList();

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
    <FlatList
      data={products}
      renderItem={({ item }) => <ProductsList product={item} />}
      numColumns={2}
      contentContainerStyle={{ gap: 10, padding: 10 }}
      columnWrapperStyle={{ gap: 10 }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
  },
});
