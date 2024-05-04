import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Image,
  ImageBackground,
} from "react-native";
import React, { useState } from "react";
import Button from "@/components/Button";
import Colors from "@/constants/Colors";
import { Link, Redirect, Stack, useNavigation, useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase";
import * as ImagePicker from "expo-image-picker";
import { randomUUID } from "expo-crypto";
import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system";
import RemoteImage from "@/components/RemoteImage";
import { defaultPizzaImg } from "@/components/ProductsList";
import { useInsertProfile } from "@/api/profiles";

const signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [full_name, setFull_name] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ifImage, setIfImage] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const { mutate: insertProfile } = useInsertProfile();

  const navigation = useNavigation();
  const router = useRouter();
  async function onSignup() {
    setLoading(true);
    if (!validate()) return;

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp(
      {
        email,
        password,
      }
    );
    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }
    const id = signUpData?.user?.id;

    console.log("userId", id);
    if (!id) {
      setError("Sign up successful, but no user ID returned.");
      setLoading(false);
      return;
    }
    console.log("hi before mutate");
    console.log("hi after mutate");
    const imagePath = await uploadImage();
    console.log("hi after img");

    try {
      insertProfile(
        { id, full_name, username, avatar_url: imagePath || null },
        {
          onSuccess: () => {
            console.log("hi after success");
            setLoading(false);
            router.replace("/(auth)/login");
          },
          onError: (error) => {
            console.error("Error inserting profile:", error);
            Alert.alert(error.message);
            setError(error.message || "Profile insertion failed");
            setLoading(false);
          },
        }
      );
      console.log("hi after mutate");
    } catch (mutationError: any) {
      console.error("Mutation error:", mutationError);
      setError(mutationError.message || "Profile insertion failed");
      setLoading(false);
    }
  }
  const validate = () => {
    setError("");
    if (!email || !password) {
      setError("Email and password are required");
      setLoading(false);

      return false;
    }
    return true;
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
  const backgroundImage = require("@assets/images/Signup.jpg");

  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.container}
      blurRadius={3}
    >
      <Stack.Screen
        options={{
          title: "Sign up",
          headerTransparent: true, // Make the header fully transparent

          headerStyle: {
            backgroundColor: "rgba(255, 255, 255, 0.5)", // Set the desired opacity here
          },
          headerTintColor: Colors.light.text, // Change header text color to make it visible against the background
        }}
      />
      <View style={styles.Form}>
        {ifImage ? (
          <Image
            source={{ uri: image || defaultPizzaImg }}
            style={styles.img}
          />
        ) : (
          <RemoteImage
            path={image}
            fallback={defaultPizzaImg}
            style={styles.img}
          />
        )}
        <Text disabled={loading} style={styles.txtBtn} onPress={pickImage}>
          User Image
        </Text>
        <View style={styles.form}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={full_name}
            onChangeText={setFull_name}
            placeholder="Full Name"
          />
        </View>
        <View style={styles.form}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder="Username"
          />
        </View>
        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
          />
        </View>
        <View style={styles.form}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.pswd}>
            <TextInput
              secureTextEntry={!show}
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
            />
            <Text
              style={styles.show}
              onPress={() => {
                setShow(!show);
              }}
            >
              {!show && <FontAwesome size={18} name="eye-slash" />}
              {show && <FontAwesome size={18} name="eye" />}
            </Text>
          </View>
        </View>
        <Text style={{ color: "red" }}>{error}</Text>
        <Button
          disabled={loading}
          width={"50%"}
          text={loading ? "Creating account..." : "Create account"}
          onPress={onSignup}
        />
        <Text>
          Already have an account?
          <Link href={"/(auth)/login"}>
            <Text style={styles.login}> Login</Text>
          </Link>
        </Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  Form: {
    backgroundColor: "rgba(255,255,255,0.7)",
    width: "90%",
    shadowColor: Colors.light.text,
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 4,
    elevation: 5,
    paddingHorizontal: 40,
    paddingTop: 5,
    paddingBottom: 10,
    borderRadius: 20,
    alignItems: "center",
  },
  input: {
    width: "100%",
    backgroundColor: Colors.light.Sec,
    height: 40,
    marginTop: 5,
    marginBottom: 15,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
  },
  label: {
    color: Colors.light.text,
    fontSize: 18,
    fontWeight: "bold",
  },
  form: {
    width: "70%",
  },
  login: {
    color: Colors.light.tabIconDefault,
    textDecorationLine: "underline",
    fontWeight: "bold",
  },
  pswd: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  show: {
    color: Colors.light.text,
    fontWeight: "bold",
    marginLeft: -30,
    marginRight: 10,
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
});
export default signup;
