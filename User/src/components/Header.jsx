import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { CartContext } from "../context/CartContext";

export default function Header() {
  const navigation = useNavigation();
  const [text, setText] = useState("");
  const { cart } = useContext(CartContext);

  const handleSearch = () => {
    if (!text.trim()) return;

    navigation.navigate("Search", {
      query: text,
    });
  };

  return (
    <LinearGradient colors={["#2EC4B6", "#3A86FF"]} style={styles.header}>

      {/* 🔥 TOP ROW */}
      <View style={styles.topRow}>
        <View>
          <Text style={styles.welcome}>Welcome to</Text>
          <Text style={styles.title}>MedLink</Text>
          <Text style={styles.subtitle}>
            Smart Emergency Health Network
          </Text>
        </View>

        {/* 🛒 CART ICON */}
        <TouchableOpacity
          style={styles.cartContainer}
          onPress={() => navigation.navigate("Cart")}
          activeOpacity={0.9}
        >
          <Ionicons name="cart-outline" size={24} color="#fff" />

          {cart.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cart.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* 🔍 SEARCH */}
      <View style={styles.searchBox}>
        <Ionicons name="search" size={20} color="#999" />

        <TextInput
          placeholder="Search for medicines..."
          placeholderTextColor="#999"
          value={text}
          onChangeText={setText}
          onSubmitEditing={handleSearch}
          style={styles.input}
          returnKeyType="search"
        />

        <TouchableOpacity onPress={handleSearch}>
          <Ionicons name="arrow-forward" size={20} color="#999" />
        </TouchableOpacity>
      </View>

    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 25,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  welcome: {
    color: "#E0F7FA",
    fontSize: 14,
  },

  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
    marginTop: 2,
  },

  subtitle: {
    color: "#E0F7FA",
    marginTop: 4,
    marginBottom: 18,
  },

  /* 🔥 CART ICON */
  cartContainer: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 10,
    borderRadius: 12,
    marginTop: 5,
  },

  badge: {
    position: "absolute",
    right: -6,
    top: -6,
    backgroundColor: "#FF3B30",
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },

  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },

  /* SEARCH */
  searchBox: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 30,
    paddingHorizontal: 15,
    paddingVertical: 12,
    alignItems: "center",
    elevation: 3,
  },

  input: {
    flex: 1,
    marginHorizontal: 10,
  },
});