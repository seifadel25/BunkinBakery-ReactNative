import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";
import React, { useEffect, useState } from "react";
import Colors from "@/constants/Colors";
import Button from "@/components/Button";
import { defaultPizzaImg } from "@/components/ProductsList";
import * as ImagePicker from "expo-image-picker";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  useDeleteProduct,
  useInsertProduct,
  useProduct,
  useUpdateProduct,
} from "@/api/products";
import * as FileSystem from "expo-file-system";
import { randomUUID } from "expo-crypto";
import { supabase } from "@/lib/supabase";
import { decode } from "base64-arraybuffer";
import RemoteImage from "@/components/RemoteImage";

const CreateProductScreen = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [errors, setErrors] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [ifImage, setIfImage] = useState(false);

  const { id: idString } = useLocalSearchParams();
  const id = parseFloat(
    typeof idString === "string" ? idString : idString?.[0]
  );
  const isUpdating = !!id;

  const router = useRouter();

  const { mutate: insertProduct } = useInsertProduct();
  const { mutate: updateProduct } = useUpdateProduct();
  const { data: updatingProduct } = useProduct(id);
  const { mutate: deleteProduct } = useDeleteProduct();

  useEffect(() => {
    if (isUpdating && updatingProduct) {
      setName(updatingProduct.name);
      setPrice(updatingProduct.price.toString());
      setImage(updatingProduct.image);
    }
  }, []);

  const onCreate = async () => {
    if (!validate()) {
      return;
    }
    setLoading(true);
    const imagePath = await uploadImage();
    // Create product
    insertProduct(
      { name, price: parseFloat(price), image: imagePath },
      {
        onSuccess: () => {
          resetValues();
          router.back();
          setLoading(false);
        },
      }
    );
  };

  const onUpdate = async () => {
    if (!validate()) {
      return;
    }
    setLoading(true);
    // Update product
    const imagePath = await uploadImage();

    updateProduct(
      { id, name, price: parseFloat(price), image: imagePath },
      {
        onError: (error) => {},
        onSuccess: () => {
          resetValues();
          router.replace("/(admin)/menu");
          setLoading(false);
        },
      }
    );
  };
  const onDelete = () => {
    // Delete product
    setLoading(true);
    deleteProduct(id, {
      onSuccess: () => {
        resetValues();
        router.navigate("/(admin)/menu");
        setLoading(false);
      },
    });
  };
  const confirmDel = () => {
    // Confirm delete
    Alert.alert(
      "Delete Product",
      "Are you sure you want to delete this product?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: onDelete,
        },
      ]
    );
  };
  const onSubmit = () => {
    if (isUpdating) {
      onUpdate();
    } else {
      onCreate();
    }
  };
  const validate = () => {
    setErrors("");
    if (!name) {
      setErrors("Name is required");
      return false;
    }
    if (!price) {
      setErrors("Price is required");
      return false;
    }
    if (isNaN(parseFloat(price))) {
      setErrors("Price must be a number");
      return false;
    }
    // if (!image) {
    //   setErrors("Image is required");
    //   return false;
    // }

    return true;
  };
  const resetValues = () => {
    setName("");
    setPrice("");
    setImage(null);
  };
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    setIfImage(true);
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  const uploadImage = async () => {
    if (!image?.startsWith("file://")) {
      return;
    }

    const base64 = await FileSystem.readAsStringAsync(image, {
      encoding: "base64",
    });
    const filePath = `${randomUUID()}.png`;
    const contentType = "image/png";
    const { data, error } = await supabase.storage
      .from("product-images")
      .upload(filePath, decode(base64), { contentType });

    if (data) {
      return data.path;
    }
  };
  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: isUpdating ? "Update Product" : "Create Product",
        }}
      />
      {ifImage ? (
        <Image source={{ uri: image || defaultPizzaImg }} style={styles.img} />
      ) : (
        <RemoteImage
          path={image}
          fallback={defaultPizzaImg}
          style={styles.img}
        />
      )}
      <Text disabled={loading} style={styles.txtBtn} onPress={pickImage}>
        Select Image
      </Text>
      <View style={styles.form}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          aria-disabled={loading}
          value={name}
          onChangeText={setName}
          placeholder="Name"
          style={styles.input}
        />
      </View>
      <View style={styles.form}>
        <Text style={styles.label}>Price</Text>
        <TextInput
          aria-disabled={loading}
          value={price}
          onChangeText={setPrice}
          placeholder="Price"
          style={styles.input}
          keyboardType="numeric"
        />
      </View>
      <Text style={{ color: "red" }}>{errors}</Text>
      <Button
        disabled={loading}
        width={"50%"}
        style={styles.btn}
        text={isUpdating ? "Update" : "Create"}
        onPress={onSubmit}
      />
      {isUpdating && (
        <Text disabled={loading} onPress={confirmDel} style={styles.txtBtn}>
          Delete
        </Text>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#fff",
    alignItems: "center",
  },
  txtBtn: {
    color: Colors.light.text,
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 5,
    marginBottom: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    backgroundColor: Colors.light.Sec,
  },
  img: {
    width: "50%",
    aspectRatio: 1,
    borderRadius: 500,
    borderWidth: 1,
    borderColor: Colors.light.Sec,
    marginBottom: 15,
  },
  input: {
    width: "100%",
    backgroundColor: Colors.light.Sec,
    height: 40,
    marginTop: 5,
    marginBottom: 15,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  label: {
    color: Colors.light.text,
    fontSize: 18,
    fontWeight: "bold",
  },
  form: {
    width: "100%",
  },
  btn: {
    marginTop: 15,
    width: "100%",
  },
});

export default CreateProductScreen;
