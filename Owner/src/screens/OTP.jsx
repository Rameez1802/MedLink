import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";
import { setUserPhone } from "../store/userStore";

export default function OTP({ route, navigation }) {
  const { phone } = route.params;
  const [otp, setOtp] = useState("");

  const verify = () => {
    if (otp === "1234") {
      setUserPhone(phone);
      navigation.replace("MainTabs");
    } else {
      alert("Invalid OTP");
    }
  };

  return (
    <View style={styles.container}>
      
      {/* 🔵 SAME HEADER AS LOGIN */}
      <LinearGradient colors={["#1E88E5", "#2EC4B6"]} style={styles.header}>
        <View style={styles.logo}>
          <Ionicons name="shield-checkmark-outline" size={28} color="#fff" />
        </View>
        <Text style={styles.appName}>Verify OTP</Text>
        <Text style={styles.tag}>Enter the code sent to {phone}</Text>
      </LinearGradient>

      {/* ⚪ CARD */}
      <View style={styles.card}>
        <Text style={styles.title}>OTP Verification</Text>
        <Text style={styles.subtitle}>Secure your account</Text>

        <Text style={styles.label}>OTP</Text>

        <View style={styles.inputBox}>
          <Ionicons name="key-outline" size={18} color="#777" />
          <TextInput
            placeholder="Enter OTP"
            style={styles.input}
            onChangeText={setOtp}
            keyboardType="numeric"
            maxLength={4}
          />
        </View>

        <TouchableOpacity onPress={verify}>
          <LinearGradient
            colors={["#1E88E5", "#2EC4B6"]}
            style={styles.button}
          >
            <Text style={styles.btnText}>Verify →</Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.bottom}>
          Didn’t receive code?{" "}
          <Text style={{ color: "#1E88E5" }}>
            Resend
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
    borderBottomRightRadius: 20,
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