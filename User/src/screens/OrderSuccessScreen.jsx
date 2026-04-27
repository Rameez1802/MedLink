import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function OrderSuccessScreen({ navigation }) {
  return (
    <View style={styles.container}>

      {/* ICON */}
      <View style={styles.iconWrapper}>
        <View style={styles.iconCircle}>
          <Ionicons name="checkmark" size={35} color="#2E7D32" />
        </View>
      </View>

      {/* TEXT */}
      <Text style={styles.title}>Order Placed!</Text>

      <Text style={styles.subtitle}>
        Your medicines are on the way. Track your order in the Orders page.
      </Text>

      {/* BUTTONS */}
      <View style={styles.btnRow}>

        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => navigation.navigate("Orders")}
        >
          <Text style={styles.primaryText}>View Orders</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => navigation.navigate("MainTabs")}
        >
          <Text style={styles.secondaryText}>Go Home</Text>
        </TouchableOpacity>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  iconWrapper: {
    marginBottom: 20,
  },

  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 10,
    color: "#222",
  },

  subtitle: {
    textAlign: "center",
    color: "#666",
    marginTop: 10,
    fontSize: 14,
    lineHeight: 20,
  },

  btnRow: {
    flexDirection: "row",
    marginTop: 30,
  },

  primaryBtn: {
    backgroundColor: "#1E88E5",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginRight: 10,
  },

  primaryText: {
    color: "#fff",
    fontWeight: "600",
  },

  secondaryBtn: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 25,
  },

  secondaryText: {
    color: "#333",
    fontWeight: "500",
  },
});