import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  RefreshControl
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";
import axios from "axios";
import BASE_URL from "../api/api";

export default function EmergencyScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [requests, setRequests] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchRequests();
    }, [])
  );

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/emergency`);
      setRequests(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRequests();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <LinearGradient
        colors={["#FF7A00", "#FF3D2E"]}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Emergency Mode</Text>
        </View>

        <View style={styles.alertBox}>
          <Ionicons name="warning-outline" size={22} color="#fff" />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.alertTitle}>Need Help Now?</Text>
            <Text style={styles.alertSub}>
              We’ll find the fastest option
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* REQUEST LIST */}
      <FlatList
        data={requests}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 120 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }

        ListHeaderComponent={
          <>
            {/* 🔴 BROADCAST CARD */}
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Send Emergency Request</Text>

              <TouchableOpacity
                style={styles.broadcastBtn}
                onPress={() => setModalVisible(true)}
              >
                <Ionicons name="radio-outline" size={18} color="#fff" />
                <Text style={styles.broadcastText}>Broadcast Request</Text>
              </TouchableOpacity>
            </View>

            {/* 🔥 NEW TITLE */}
            <Text style={styles.listTitle}>Your Requests</Text>
          </>
        }

        renderItem={({ item }) => (
          <View style={styles.requestCard}>

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

            <Text style={styles.reqSub}>📍 {item.address}</Text>
            <Text style={styles.reqSub}>📞 {item.phone}</Text>

            {item.status === "Accepted" && (
              <View style={styles.acceptBox}>
  
                <View style={{ marginLeft: 6 }}>
                  <Text style={{ fontWeight: "600" , marginBottom:5}}>
                    {item.acceptedBy?.pharmacyName}
                  </Text>

                  <Text style={{ fontSize: 12, color: "#555", marginBottom:2 }}>
                    👤  {item.acceptedBy?.ownerName}
                  </Text>

                  <Text style={{ fontSize: 12, color: "#555", marginBottom:2 }}>
                    📞  {item.acceptedBy?.phone}
                  </Text>

                  <Text style={{ fontSize: 12, color: "#777", marginBottom:2 }}>
                    📍 {item.acceptedBy?.address}
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}
      />

      {/* MODAL */}
      <Modal transparent visible={modalVisible}>
        <View style={styles.modal}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Select Type</Text>

            <TouchableOpacity
              style={styles.typeBtn}
              onPress={() => {
                setModalVisible(false);
                navigation.navigate("EmergencyForm", {
                  type: "medicine",
                });
              }}
            >
              <Text style={styles.typeText}>💊 Medicine</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.typeBtn}
              onPress={() => {
                setModalVisible(false);
                navigation.navigate("EmergencyForm", {
                  type: "blood",
                });
              }}
            >
              <Text style={styles.typeText}>🩸 Blood</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    marginBottom: 20,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
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
  listTitle: {
    marginTop: 15,
    marginHorizontal: 20,
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginTop: 15,
    padding: 18,
    borderRadius: 20,
    elevation: 3,
  },

  sectionTitle: {
    fontWeight: "700",
    marginBottom: 12,
  },

  broadcastBtn: {
    flexDirection: "row",
    backgroundColor: "#FF3D2E",
    padding: 15,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },

  broadcastText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 8,
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

  acceptBox: {
    flexDirection: "row",
    marginTop: 12,
    alignItems: "flex-start",
    backgroundColor: "#F1F8FF",
    padding: 10,
    borderRadius: 12,
  },

  modal: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  modalCard: {
    backgroundColor: "#fff",
    margin: 20,
    padding: 20,
    borderRadius: 20,
  },

  modalTitle: {
    fontWeight: "700",
    marginBottom: 10,
  },

  typeBtn: {
    backgroundColor: "#F1F3F5",
    padding: 15,
    borderRadius: 15,
    marginTop: 10,
    alignItems: "center",
  },

  typeText: {
    fontWeight: "600",
  },
});