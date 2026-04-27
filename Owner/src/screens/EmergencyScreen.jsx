import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";
import axios from "axios";
import BASE_URL from "../api/api";
import { Linking } from "react-native";

export default function EmergencyScreen() {
  const [requests, setRequests] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const callUser = (phone) => {
    Linking.openURL(`tel:${phone}`);
  };
  const acceptRequest = async (id) => {
    try {
      await axios.patch(`${BASE_URL}/emergency/accept/${id}`, {
        ownerName: "Rameez",              // 🔥 replace later with dynamic
        phone: "8840152852",
        pharmacyName: "MedLink Pharmacy",
        address: "Your Shop Address",
      });

      fetchRequests(); // refresh UI
    } catch (err) {
      console.log(err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchRequests();
    }, [])
  );

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/emergency`);
      setRequests(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRequests();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>

      {/* 🔥 HEADER */}
      <LinearGradient
        colors={["#FF7A00", "#FF3D2E"]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Emergency Requests</Text>

        <View style={styles.alertBox}>
          <Ionicons name="warning-outline" size={22} color="#fff" />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.alertTitle}>
              Urgent requests nearby
            </Text>
            <Text style={styles.alertSub}>
              Help users instantly
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* TITLE */}
      <Text style={styles.listTitle}>Live Requests</Text>

      {/* LIST */}
      <FlatList
        data={requests}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 120 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }

        renderItem={({ item }) => (
          <View style={styles.requestCard}>

            {/* TOP */}
            <View style={styles.rowBetween}>
              <Text style={styles.reqTitle}>
                {item.type === "medicine"
                  ? item.medicine
                  : item.bloodGroup}
              </Text>

              <Text
                style={[
                  styles.statusBadge,
                  item.status === "Accepted"
                    ? styles.accepted
                    : styles.pending,
                ]}
              >
                {item.status}
              </Text>
            </View>

            {/* DETAILS */}
            <Text style={styles.reqSub}>📍 {item.address}</Text>
            <Text style={styles.reqSub}>📞 {item.phone}</Text>

            {/* 🔥 ACCEPT BUTTON ONLY */}
            <View style={styles.actionRow}>

              {/* ACCEPT / ACCEPTED BUTTON */}
              <TouchableOpacity
                style={[
                  styles.acceptBtn,
                  item.status === "Accepted" && styles.acceptedBtn
                ]}
                disabled={item.status === "Accepted"}
                onPress={() => acceptRequest(item._id)} // 🔥 ADD THIS
              >
                <Text style={styles.white}>
                  {item.status === "Accepted" ? "Accepted" : "Accept"}
                </Text>
              </TouchableOpacity>

              {/* CALL BUTTON */}
              <TouchableOpacity
                style={styles.callBtn}
                onPress={() => callUser(item.phone)}
              >
                <Ionicons name="call-outline" size={16} color="#1E88E5" />
                <Text style={styles.callText}>Call</Text>
              </TouchableOpacity>

            </View>

          </View>
        )}
      />
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

  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 15,
  },

  alertBox: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 15,
    borderRadius: 15,
  },

  alertTitle: { color: "#fff", fontWeight: "700" },
  alertSub: { color: "#fff", fontSize: 12 },

  listTitle: {
    marginTop: 15,
    marginHorizontal: 20,
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },

  requestCard: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginTop: 12,
    padding: 15,
    borderRadius: 20,
    elevation: 2,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  reqTitle: {
    fontWeight: "700",
    fontSize: 16,
  },

  reqSub: {
    color: "#777",
    marginTop: 5,
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
    fontSize: 12,
  },

  pending: {
    backgroundColor: "#FFF3E0",
    color: "#FB8C00",
  },

  accepted: {
    backgroundColor: "#E8F5E9",
    color: "green",
  },

  acceptBtn: {
    marginTop: 12,
    backgroundColor: "#FF3D2E",
    padding: 12,
    borderRadius: 25,
    alignItems: "center",
  },

  acceptBox: {
    flexDirection: "row",
    marginTop: 10,
    alignItems: "center",
  },

  white: {
    color: "#fff",
    fontWeight: "600",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },

  callBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1E88E5",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 25,
  },

  callText: {
    color: "#1E88E5",
    marginLeft: 5,
    fontWeight: "600",
  },

  acceptBtn: {
    backgroundColor: "#FF3D2E",
    paddingVertical: 10,
    paddingHorizontal: 130,
    borderRadius: 25,
  },
  acceptedBtn: {
    backgroundColor: "#BDBDBD",
    paddingHorizontal: 122,

  },
});