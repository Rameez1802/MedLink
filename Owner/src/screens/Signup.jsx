import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";
import axios from "axios";
import BASE_URL from "../api/api";

export default function Signup({ navigation }) {
  const [form, setForm] = useState({
    ownerName: "",
    phone: "",
    name: "",
    address: "",
  });

  const signup = async () => {
    try {
      await axios.post(`${BASE_URL}/owner/signup`, form);
      navigation.navigate("Login");
    } catch {
      alert("Already registered");
    }
  };

  return (
    <View style={styles.container}>
      
      {/* HEADER */}
      <LinearGradient colors={["#1E88E5", "#2EC4B6"]} style={styles.header}>
        <View style={styles.logo}>
          <Ionicons name="heart-outline" size={28} color="#fff" />
        </View>
        <Text style={styles.appName}>MedLink</Text>
        <Text style={styles.tag}>Smart Emergency Health Network</Text>
      </LinearGradient>

      {/* CARD */}
      <View style={styles.card}>
        <Text style={styles.title}>Create account</Text>
        <Text style={styles.subtitle}>Join MedLink today</Text>

        {[
          { label: "FULL NAME", key: "ownerName", icon: "person-outline" },
          { label: "PHONE", key: "phone", icon: "call-outline" },
          { label: "PHARMACY NAME", key: "name", icon: "medkit-outline" },
          { label: "ADDRESS", key: "address", icon: "location-outline" },
        ].map((item, i) => (
          <View key={i}>
            <Text style={styles.label}>{item.label}</Text>
            <View style={styles.inputBox}>
              <Ionicons name={item.icon} size={18} color="#777" />
              <TextInput
                placeholder={item.label}
                style={styles.input}
                onChangeText={(v) =>
                  setForm({ ...form, [item.key]: v })
                }
              />
            </View>
          </View>
        ))}

        {/* BUTTON */}
        <TouchableOpacity onPress={signup}>
          <LinearGradient
            colors={["#1E88E5", "#2EC4B6"]}
            style={styles.button}
          >
            <Text style={styles.btnText}>Create Account →</Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.bottom}>
          Already have an account?{" "}
          <Text
            style={{ color: "#1E88E5" }}
            onPress={() => navigation.navigate("Login")}
          >
            Sign In
          </Text>
        </Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA" },

  header: {
    height: 300,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius:20,
    alignItems: "center",
    justifyContent: "center",
  },

  logo: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 15,
    borderRadius: 20,
  },

  appName: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "700",
    marginTop: 10,
  },

  tag: {
    color: "#fff",
    opacity: 0.9,
    marginTop: 5,
  },

  card: {
    backgroundColor: "#fff",
    margin: 20,
    marginTop: -50,
    padding: 20,
    borderRadius: 20,
    elevation: 6,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
  },

  subtitle: {
    color: "#777",
    marginBottom: 15,
  },

  label: {
    marginTop: 10,
    fontSize: 12,
    color: "#777",
  },

  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F3F5",
    borderRadius: 15,
    paddingHorizontal: 10,
    marginTop: 5,
  },

  input: {
    flex: 1,
    padding: 12,
  },

  button: {
    marginTop: 20,
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
  },

  btnText: {
    color: "#fff",
    fontWeight: "600",
  },

  bottom: {
    textAlign: "center",
    marginTop: 20,
    color: "#777",
  },
});