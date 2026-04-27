import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const Button = ({ title, colors, icon }) => (
  <LinearGradient colors={colors} style={styles.card}>
    <Icon name={icon} size={24} color="#fff" />
    <Text style={styles.text}>{title}</Text>
  </LinearGradient>
);

export default function ActionButtons() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>

      {/* QUICK ORDER */}
      <Pressable
        onPress={() => navigation.navigate("Search")}
        style={({ pressed }) => [
          styles.pressable,
          pressed && styles.pressed, // 🔥 subtle effect
        ]}
      >
        <Button
          title="Quick Order"
          icon="flash"
          colors={["#36D1DC", "#5B86E5"]}
        />
      </Pressable>

      {/* EMERGENCY */}
      <Pressable
        onPress={() => navigation.navigate("Emergency")}
        style={({ pressed }) => [
          styles.pressable,
          pressed && styles.pressed,
        ]}
      >
        <Button
          title="Emergency"
          icon="pulse"
          colors={["#FF7A00","#FF3D2E"]}
        />
      </Pressable>

      {/* BLOOD */}
      <Pressable
        onPress={() => navigation.navigate("Blood")}
        style={({ pressed }) => [
          styles.pressable,
          pressed && styles.pressed,
        ]}
      >
        <Button
          title="Blood Donor"
          icon="water"
          colors={["#ff5a4e", "#e60000"]}
        />
      </Pressable>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 20,
  },

  card: {
    width: 125,
    height: 105,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },

  text: {
    color: "#fff",
    marginTop: 8,
    fontWeight: "600",
  },
  pressable: {
    borderRadius: 20,
  },

  pressed: {
    transform: [{ scale: 0.97 }], 
  },
});