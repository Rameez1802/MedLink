import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";
import axios from "axios";
import BASE_URL from "../api/api";
import { getUserPhone } from "../store/userStore";
import { useFocusEffect } from "@react-navigation/native";

export default function ProfileScreen({navigation}) {

  const phone = getUserPhone(); 
  const [shop, setShop] = useState(null);

  // 🔥 FETCH OWNER DATA (LIKE HOME)
  useFocusEffect(
    useCallback(() => {
      fetchShop();
    }, [])
  );

  const fetchShop = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/owner/${phone}`);
      setShop(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  if (!shop) return null;

  return (
    <View style={styles.container}>

      {/* 🔵 HEADER */}
      <LinearGradient
        colors={["#2196F3", "#2EC4B6"]}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        <View style={styles.profileRow}>
          <View style={styles.avatar}>
            <Ionicons name="medkit-outline" size={30} color="#fff" />
          </View>

          <View style={{ marginLeft: 15 }}>
            {/* 🔥 DYNAMIC DATA */}
            <Text style={styles.name}>{shop.name}</Text>
            <Text style={styles.phone}>{shop.phone}</Text>
          </View>
        </View>
      </LinearGradient>

      {/* 🔴 LOGOUT ONLY */}
      <TouchableOpacity style={styles.logoutCard} onPress={()=> navigation.navigate("Login")}>
        <View style={styles.left}>
          <View style={styles.logoutIcon}>
            <Ionicons name="log-out-outline" size={20} color="#E53935" />
          </View>
          <Text style={styles.logoutText}>Logout</Text>
        </View>
      </TouchableOpacity>

    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },

  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 10,
  },

  profileRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 70,
    height: 70,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },

  name: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },

  phone: {
    color: "#E0F7FA",
    marginTop: 3,
  },

  logoutCard: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginTop: 20,
    padding: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#FFCDD2",
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
  },

  logoutIcon: {
    backgroundColor: "#FFEBEE",
    padding: 10,
    borderRadius: 15,
    marginRight: 10,
  },

  logoutText: {
    color: "#E53935",
    fontWeight: "600",
  },
});