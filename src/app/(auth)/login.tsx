import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ImageBackground,
} from "react-native";
import React, { useState } from "react";
import Colors from "@/constants/Colors";
import Button from "@/components/Button";
import { Link, Stack, useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase";

const login = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onLogin() {
    setLoading(true);
    if (!validate()) return;

    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert(error.message);
      setLoading(false);
      return;
    }
    setLoading(false);
    router.replace("/(user)/menu");
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
  const backgroundImage = require("@assets/images/Login.jpg");
  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.container}
      blurRadius={3}
    >
      <Stack.Screen
        options={{
          title: "Login",
          headerTransparent: true, // Make the header fully transparent
          headerStyle: {
            backgroundColor: "rgba(255, 255, 255, 0.5)", // Set the desired opacity here
          },
          headerTintColor: Colors.light.text, // Change header text color to make it visible against the background
        }}
      />
      <View style={styles.Form}>
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
          text={loading ? "Logging in..." : "Login"}
          onPress={onLogin}
        />
        <Text>
          Don't have an account?
          <Link href={"/(auth)/signup"}>
            <Text style={styles.login}> Signup</Text>
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
    paddingVertical: 20,
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
});
export default login;
