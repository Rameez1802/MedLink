import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Linking,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";
import axios from "axios";
import BASE_URL from "../api/api";

export default function BloodScreen() {
  const [activeGroup, setActiveGroup] = useState("All");
  const [donors, setDonors] = useState([]);
  const [modal, setModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    bloodGroup: "",
  });

  const groups = ["All", "A+", "A-", "B+", "B-", "AB+", "O+", "O-"];

  useFocusEffect(
    React.useCallback(() => {
      fetchDonors();
    }, [])
  );

  const fetchDonors = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/donors`);
      setDonors(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  //  Pull to refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchDonors();
    setRefreshing(false);
  }, []);

  const addDonor = async () => {
    try {
      await axios.post(`${BASE_URL}/donors`, form);
      setModal(false);
      setForm({
        name: "",
        phone: "",
        address: "",
        bloodGroup: "",
      });
      fetchDonors();
    } catch (err) {
      console.log(err);
    }
  };

  const callUser = (phone) => {
    Linking.openURL(`tel:${phone}`);
  };

  const filtered =
    activeGroup === "All"
      ? donors
      : donors.filter((d) => d.bloodGroup === activeGroup);

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <LinearGradient colors={["#ff5a4e", "#e60000"]} style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Blood Donors</Text>
        </View>

        <View style={styles.alertBox}>
          <Ionicons name="water-outline" size={22} color="#fff" />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.alertTitle}>{donors.length} available</Text>
            <Text style={styles.alertSub}>
              Connect instantly with nearby donors
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* LIST */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ paddingBottom: 120 }}

        ListHeaderComponent={
          <>
            {/* ACTION CARD */}
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Become a Donor</Text>

              <TouchableOpacity
                style={styles.mainBtn}
                onPress={() => setModal(true)}
              >
                <Text style={styles.mainBtnText}>+ Become Donor</Text>
              </TouchableOpacity>
            </View>
            {/* FILTER */}
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={groups}
              keyExtractor={(item) => item}
              style={{ marginTop: 10 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => setActiveGroup(item)}
                  style={[
                    styles.filterBtn,
                    activeGroup === item && styles.activeFilter,
                  ]}
                >
                  <Text
                    style={{
                      color: activeGroup === item ? "#fff" : "#000",
                    }}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>

              )}
            />
            <Text style={styles.listTitle}>Nearby Donors</Text>
          </>
        }

        renderItem={({ item }) => (
          <View style={styles.card}>

            <View style={styles.cardRow}>

              {/* LEFT */}
              <View style={styles.leftSection}>
                <View style={styles.groupCircle}>
                  <Text style={styles.groupText}>
                    {item.bloodGroup}
                  </Text>
                </View>

                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.sub}>{item.address}</Text>
                </View>
              </View>

              {/* RIGHT */}
              <TouchableOpacity
                style={styles.callBtn}
                onPress={() => callUser(item.phone)}
              >
                <Ionicons name="call-outline" size={18} />
              </TouchableOpacity>

            </View>

          </View>
        )}
      />

      {/* MODAL */}
      <Modal visible={modal} transparent>
        <View style={styles.modal}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Become Donor</Text>

            <TextInput
              placeholder="Name"
              style={styles.input}
              value={form.name}
              onChangeText={(v) => setForm({ ...form, name: v })}
            />

            <TextInput
              placeholder="Phone"
              style={styles.input}
              value={form.phone}
              onChangeText={(v) => setForm({ ...form, phone: v })}
            />

            <TextInput
              placeholder="Address"
              style={styles.input}
              value={form.address}
              onChangeText={(v) => setForm({ ...form, address: v })}
            />

            <TextInput
              placeholder="Blood Group"
              style={styles.input}
              value={form.bloodGroup}
              onChangeText={(v) =>
                setForm({ ...form, bloodGroup: v })
              }
            />

            <TouchableOpacity style={styles.submitBtn} onPress={addDonor}>
              <Text style={{ color: "#fff" }}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setModal(false)}>
              <Text style={{ textAlign: "center", marginTop: 10 }}>
                Cancel
              </Text>
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
    marginBottom: 10,
  },

  mainBtn: {
    flexDirection: "row",
    backgroundColor: "#e60000",
    padding: 15,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },

  mainBtnText: {
    color: "#fff",
    fontWeight: "600",
  },

  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    marginLeft: 15,
  },

  activeFilter: {
    backgroundColor: "#e60000",
    borderColor: "#e60000",
  },

  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  groupCircle: {
    width: 45,
    height: 45,
    borderRadius: 22,
    backgroundColor: "#e60000",
    justifyContent: "center",
    alignItems: "center",
  },

  groupText: {
    color: "#fff",
    fontWeight: "700",
  },

  name: {
    fontWeight: "700",
    fontSize: 14,
  },

  sub: {
    color: "#777",
    fontSize: 11,
  },

  callBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
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

  input: {
    backgroundColor: "#F1F3F5",
    padding: 12,
    borderRadius: 12,
    marginTop: 10,
  },

  submitBtn: {
    backgroundColor: "#e60000",
    padding: 14,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 15,
  },
});