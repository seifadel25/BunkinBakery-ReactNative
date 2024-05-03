import { View, Text, ActivityIndicator } from "react-native";
import React from "react";
import Button from "../components/Button";
import { Link, Redirect } from "expo-router";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/lib/supabase";

const index = () => {
  const { session, loading, isAdmin, profile } = useAuth();
  const signOut = async () => {
    console.warn("sinning out");
    await supabase.auth.signOut();
    console.warn("signed out");
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }
  if (!session) {
    return <Redirect href={"/login"} />;
  }
  if (profile.group === "USER" || !isAdmin) {
    return <Redirect href={"/(user)"} />;
  }
  if (profile.group === "ADMIN") {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          padding: 10,
          alignItems: "center",
        }}
      >
        <Link href={"/(user)"} asChild>
          <Button width={"50%"} text="User" />
        </Link>
        <Link href={"/(admin)"} asChild>
          <Button width={"50%"} text="Admin" />
        </Link>
        <Link href={"/(auth)/signup"} asChild>
          <Button width="50%" text="Sign up" />
        </Link>
        <Button onPress={signOut} width="50%" text="Sign out" />
      </View>
    );
  }
  return <Redirect href="/(user)" />;
};

export default index;
