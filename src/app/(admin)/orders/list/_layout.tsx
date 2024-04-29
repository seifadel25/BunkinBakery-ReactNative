import { View, Text } from "react-native";
import React from "react";
import { Tabs, withLayoutContext } from "expo-router";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "@/constants/Colors";
const TopTabs = withLayoutContext(createMaterialTopTabNavigator().Navigator);

const ListNavigator = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <TopTabs screenOptions={{tabBarIndicatorStyle:{backgroundColor:Colors.light.tint}}} />
    </SafeAreaView>
  );
};

export default ListNavigator;
