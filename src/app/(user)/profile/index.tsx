import { View, Text } from "react-native";
import React from "react";
import Button from "@/components/Button";
import { supabase } from "@/lib/supabase";

const profile = () => {
  return (
    <View>
      <Text>index</Text>
      <Button
        width={"50%"}
        text="sign out"
        onPress={async () => {
          await supabase.auth.signOut();
        }}
      />
    </View>
  );
};

export default profile;
