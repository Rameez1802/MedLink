import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import axios from "axios";
import BASE_URL from "../api/api";
import { getUserPhone } from "../store/userStore";
import { useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function OrdersScreen() {
  const phone = String(getUserPhone());
  const insets = useSafeAreaInsets();
  
  const [orders, setOrders] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [refreshing, setRefreshing] = useState(false);

  // FETCH
  const fetchOrders = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/owner/orders/${phone}`);
    setOrders(res.data);
    setFiltered(res.data);
  } catch (err) {
    console.log("Error fetching orders:", err);
  }
};

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  // FILTER
  const filterOrders = (tab) => {
    setActiveTab(tab);

    if (tab === "All") {
      setFiltered(orders);
    } else {
      setFiltered(orders.filter((o) => mapStatus(o.status) === tab));
    }
  };

  const mapStatus = (status) => {
    if (status === "Accepted") return "Accepted";
    if (status === "Out") return "Dispatch";
    if (status === "Delivered") return "Delivered";
    return "Pending";
  };

  // UPDATE STATUS
  const updateStatus = async (id, status) => {
    await axios.patch(`${BASE_URL}/owner/orders/${id}`, { status });
    fetchOrders();
  };

  // CARD UI
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {/* TOP */}
      <View style={styles.topRow}>
  <View>
    <View style={styles.row}>
      <Text style={styles.orderId}>
        ORD-{item._id.slice(-4)}
      </Text>

      <View style={[styles.badge, getStatusColor(item.status)]}>
        <Text style={styles.badgeText}>
          {mapStatus(item.status)}
        </Text>
      </View>
    </View>

    <Text style={styles.name}>{item.address}</Text>
  </View>

  {/* RIGHT SIDE */}
  <View style={{ alignItems: "flex-end" }}>
    <Text style={styles.price}>₹{item.total}</Text>

    <Text style={styles.payment}>
      {item.paymentMethod === "COD" ? "COD" : "Paid"}
    </Text>
  </View>
</View>

      {/* ITEMS */}
      <View style={styles.itemsBox}>
        {item.items.map((i, index) => (
          <View key={index} style={styles.itemRow}>
            <Text style={styles.itemText}>{i.name}</Text>
            <Text style={styles.itemQty}>x{i.qty}</Text>
          </View>
        ))}
      </View>

      {/* ACTION BUTTON */}
      {item.status === "Pending" && (
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => updateStatus(item._id, "Accepted")}
        >
          <Text style={styles.white}>Accept</Text>
        </TouchableOpacity>
      )}

      {item.status === "Accepted" && (
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => updateStatus(item._id, "Out")}
        >
          <Text style={styles.white}>Out for delivery</Text>
        </TouchableOpacity>
      )}

      {item.status === "Out" && (
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => updateStatus(item._id, "Delivered")}
        >
          <Text style={styles.white}>Delivered</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* HEADER */}
      <Text style={styles.title}>Orders</Text>
      <Text style={styles.subtitle}>{filtered.length} Orders</Text>

      {/* TABS */}
      <View style={styles.tabs}>
        {["All", "Pending", "Accepted", "Dispatch", "Delivered"].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => filterOrders(tab)}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
          >
            <Text style={activeTab === tab && styles.activeText}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* LIST */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}

// STATUS COLORS
const getStatusColor = (status) => {
  if (status === "Pending") return { backgroundColor: "#FCE8D5" };
  if (status === "Accepted") return { backgroundColor: "#D6EAF8" };
  if (status === "Out") return { backgroundColor: "#E8DAEF" };
  if (status === "Delivered") return { backgroundColor: "#D5F5E3" };
};

// STYLES
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#F4F6F8",
  },

  title: { fontSize: 22, fontWeight: "bold" },
  subtitle: { color: "gray", marginBottom: 10 },

  tabs: {
    flexDirection: "row",
    backgroundColor: "#E9EEF2",
    borderRadius: 25,
    padding: 5,
    marginBottom: 15,
    justifyContent: "space-between",
  },

  tab: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },

  activeTab: { backgroundColor: "#fff" },
  activeText: { fontWeight: "bold" },

  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  orderId: { fontWeight: "bold", fontSize: 15 },
  name: { color: "#666", marginTop: 4 },
  price: { fontWeight: "bold", fontSize: 16 },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },

  itemsBox: {
    backgroundColor: "#F1F4F6",
    padding: 12,
    borderRadius: 12,
    marginVertical: 12,
  },

  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },

  itemText: { color: "#333" },
  itemQty: { color: "#555" },

  primaryBtn: {
    backgroundColor: "#1E88E5",
    paddingVertical: 13,
    borderRadius: 25,
    alignItems: "center",
  },

  white: {
    color: "#fff",
    fontWeight: "600",
  },
  payment: {
  marginTop: 4,
  fontSize: 13,
  fontWeight: "600",
  color: "#7d7e80"
},
});