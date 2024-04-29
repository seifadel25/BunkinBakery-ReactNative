import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
// import products from "@assets/data/products";
import ProductsList from "@components/ProductsList";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useProductList } from "@/api/products";
import { Text } from "react-native-elements";

export default function MenuScreen() {
  const { session, loading } = useAuth();
  const { data: products, isLoading, error } = useProductList();
  // const { data, error } = await supabase.from("products").select("*");
  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     const { data, error } = await supabase
  //       .from("products")
  //       .select("*")
  //       .order("price", { ascending: false });
  //     if (error) {
  //       console.log(error);
  //     }
  //     console.log(data);
  //   };
  //   fetchProducts();
  // }, []);
  console.log(session?.user.email);
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
