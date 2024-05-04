import { View, Text, StyleSheet, FlatList } from "react-native";
import React from "react";
import Button from "@/components/Button";
import { supabase } from "@/lib/supabase";
import RemoteImage from "@/components/RemoteImage";
import { useProfile } from "@/api/profiles";
import { useAuth } from "@/providers/AuthProvider";
import { router } from "expo-router";

const profile = () => {
  const { profile } = useAuth();
  // const [data, error] = useProfile(profile?.id);
  const { data, error } = useProfile(profile?.id);
  if (!data) {
    return <Text>loading...</Text>;
  }
  if (error) {
    return <Text>{error.message}</Text>;
  }
  return (
    <View style={styles.container}>
      <View style={styles.head}>
        <RemoteImage
          style={styles.img}
          path={data.avatar_url}
          fallback="https://picsum.photos/200"
        />
        <View>
          <Text style={styles.name}>{data.full_name}</Text>
          <Text style={styles.Uname}>{data.username}</Text>
        </View>
      </View>
      <View style={styles.body}>
        <View style={styles.item}>
          <Text>Contact Us</Text>
        </View>
        <View style={styles.item}>
          <Text>About Us</Text>
        </View>
        <View style={styles.item}>
          <Text>Privacy Policy</Text>
        </View>
        <View style={styles.item}>
          <Text>Terms and Conditions</Text>
        </View>
        <View style={styles.item}>
          <Text>FAQs</Text>
        </View>
        <View style={styles.item}>
          <Text>Locations</Text>
        </View>
      </View>
      <Button
        width={"50%"}
        text="Sign out"
        onPress={async () => {
          await supabase.auth.signOut();
        }}
      />
      {profile.group === "ADMIN" && (
        <Button
          width={"50%"}
          text="Admin Panel"
          onPress={() => {
            router.push("/(admin)/menu");
          }}
        />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    padding: 20,
    alignItems: "flex-start",
  },
  head: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  img: {
    width: 120,
    height: 120,
    borderRadius: 30,
    marginTop: 15,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 20,
  },
  Uname: {
    fontSize: 14,
    fontWeight: "100",
    marginLeft: 20,
    color: "gray",
  },
  body: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
    marginTop: 20,
    width: "100%",
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 60,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
    marginVertical: 5,
    justifyContent: "center",
  },
});

export default profile;
