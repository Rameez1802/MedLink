import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";
import axios from "axios";
import BASE_URL from "../api/api";


export default function EmergencyForm({ route, navigation }) {
  // SAFE FIX 
  const type = route?.params?.type || "medicine";

  const [form, setForm] = useState({
    medicine: "",
    bloodGroup: "",
    phone: "",
    address: "",
  });

  const submit = async () => {
    if (!form.phone || !form.address) return;

    try {
      await axios.post(`${BASE_URL}/emergency`, {
        ...form,
        type,
      });

      navigation.goBack();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={styles.container}>
      
      {/* HEADER (MATCH BLOOD SCREEN) */}
      <LinearGradient
        colors={["#FF7A00", "#FF3D2E"]}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Emergency Request</Text>
        </View>

        <View style={styles.alertBox}>
          <Ionicons name="alert-circle-outline" size={22} color="#fff" />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.alertTitle}>Fill details carefully</Text>
            <Text style={styles.alertSub}>
              Nearby users or shops owner will receive your request
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* FORM */}
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        
        <View style={styles.card}>
          
          {/* MEDICINE */}
          {type === "medicine" && (
            <>
              <Text style={styles.label}>MEDICINE NAME</Text>
              <TextInput
                placeholder="Enter medicine name"
                style={styles.input}
                onChangeText={(v) =>
                  setForm({ ...form, medicine: v })
                }
              />
            </>
          )}

          {/* BLOOD */}
          {type === "blood" && (
            <>
              <Text style={styles.label}>BLOOD GROUP</Text>
              <TextInput
                placeholder="Enter blood group (A+, O-, etc)"
                style={styles.input}
                onChangeText={(v) =>
                  setForm({ ...form, bloodGroup: v })
                }
              />
            </>
          )}

          {/* PHONE */}
          <Text style={styles.label}>PHONE NUMBER</Text>
          <TextInput
            placeholder="Enter phone number"
            keyboardType="numeric"
            style={styles.input}
            onChangeText={(v) =>
              setForm({ ...form, phone: v })
            }
          />

          {/* ADDRESS */}
          <Text style={styles.label}>ADDRESS</Text>
          <TextInput
            placeholder="Enter full address"
            style={[styles.input, { height: 80 }]}
            multiline
            textAlignVertical="top"
            onChangeText={(v) =>
              setForm({ ...form, address: v })
            }
          />

          {/* BUTTON */}
          <TouchableOpacity style={styles.btn} onPress={submit}>
            <Text style={styles.btnText}>
              🚀 Send Emergency Request
            </Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
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

  alertBox: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 15,
    borderRadius: 15,
  },

  alertTitle: {
    color: "#fff",
    fontWeight: "700",
  },

  alertSub: {
    color: "#fff",
    fontSize: 12,
  },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginTop: 15,
    padding: 18,
    borderRadius: 20,
    elevation: 3,
  },

  label: {
    marginTop: 12,
    color: "#777",
    fontSize: 12,
    fontWeight: "600",
  },

  input: {
    backgroundColor: "#F1F3F5",
    padding: 14,
    borderRadius: 15,
    marginTop: 5,
  },

  btn: {
    marginTop: 25,
    backgroundColor: "#FF3D2E",
    padding: 16,
    borderRadius: 30,
    alignItems: "center",
  },

  btnText: {
    color: "#fff",
    fontWeight: "700",
  },
});