import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import { Product } from "@/types";
import { Link, useSegments } from "expo-router";
import Colors from "@/constants/Colors";
import { usePathname } from "expo-router";
import { Tables } from "@/database.types";
import RemoteImage from "./RemoteImage";

export const defaultPizzaImg =
  "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/default.png";

type ProductsListProps = {
  product: Tables<"products">;
};

const ProductsList = ({ product }: ProductsListProps) => {
  const segments = useSegments();
  let path = "/" + segments[0] + "/menu/" + product.id;
  path = path.toString();
  return (
    <Link href={path} asChild>
      <Pressable style={styles.container}>
        {/* <Image
          source={{ uri: product.image || defaultPizzaImg }}
          style={styles.img}
        /> */}
        <RemoteImage
          path={product.image}
          fallback={defaultPizzaImg}
          style={styles.img}
        />
        <Text style={styles.title}>{product.name}</Text>
        {/* <Text style={styles.price}>{(product.price * 10).toFixed(1)} EGP</Text> */}
        <Text style={styles.price}>{product.price} EGP</Text>
      </Pressable>
    </Link>
  );
};
export default ProductsList;
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 20,
    flex: 1,
    overflow: "visible",
    justifyContent: "space-evenly",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginVertical: 15,
  },
  price: {
    fontSize: 18,
    color: Colors.light.tint,
    fontWeight: "500",
  },
  img: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
    borderRadius: 20,
    overflow: "visible",
  },
});
