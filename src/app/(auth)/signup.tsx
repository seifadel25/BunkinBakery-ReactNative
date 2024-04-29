import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import React, { useState } from "react";
import Button from "@/components/Button";
import Colors from "@/constants/Colors";
import { Link, Redirect, Stack, useNavigation, useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase";
const signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();
  const router = useRouter();
  async function onSignup() {
    setLoading(true);
    if (!validate()) return;

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      Alert.alert(error.message);
      setLoading(false);
      return;
    }
    setLoading(false);
    router.replace("/(auth)/login");

    //navigation.navigate("/(auth)/login");
    // return <Redirect href="/(auth)/login" />;
    // Handle sign up.
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

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Sign up" }} />
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
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
export default signup;
