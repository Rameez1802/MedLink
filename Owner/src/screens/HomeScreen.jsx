import React, { useState, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    RefreshControl,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";
import axios from "axios";
import BASE_URL from "../api/api";
import { getUserPhone } from "../store/userStore";
import { useSafeAreaInsets } from "react-native-safe-area-context";


export default function HomeScreen({ route, navigation }) {
    const phone = getUserPhone();
    const [shop, setShop] = useState(null);
    const [orders, setOrders] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const insets = useSafeAreaInsets();


    // 🔥 FETCH DATA
    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [])
    );

    const fetchData = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/owner/${phone}`);
            setShop(res.data);

            const orderRes = await axios.get(`${BASE_URL}/owner/orders/${phone}`);
            setOrders(orderRes.data);

        } catch (err) {
            console.log(err);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    };

    // 🔥 TOGGLE SHOP
    const toggleShop = async () => {
        try {
            const res = await axios.patch(
                `${BASE_URL}/owner/status/${phone}`,
                { open: !shop.open }
            );
            setShop(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const acceptOrder = async (id) => {
        try {
            await axios.patch(`${BASE_URL}/owner/orders/${id}`, {
                status: "Accepted",
            });

            fetchData(); // 🔥 refresh list
        } catch (err) {
            console.log(err);
        }
    };

    if (!shop) return null;

    return (

        <View style={{ flex: 1, backgroundColor: "#F5F7FA" }}>

            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >

                {/* 🔥 HEADER */}
                <LinearGradient colors={["#1E88E5", "#00C6A7"]} style={[
                    styles.header,
                    { paddingTop: insets.top + 10 } // ✅ FIX HERE
                ]}>
                    <Text style={styles.smallText}>WELCOME TO</Text>
                    <Text style={styles.title}>{shop.name}</Text>
                    <Text style={styles.subtitle}>Smart Pharmacy Operations</Text>

                    {/* STATUS */}
                    <Text style={styles.status}>
                        {shop.open
                            ? "🟢 You are live — accepting orders"
                            : "⚪ Shop closed — you are offline"}
                    </Text>

                    {/* TOGGLE */}
                    <TouchableOpacity onPress={toggleShop}>
                        <LinearGradient
                            colors={
                                shop.open
                                    ? ["#FF3D3D", "#FF0055"]
                                    : ["#EDEDED", "#EDEDED"]
                            }
                            style={styles.openCard}
                        >
                            <View style={styles.openLeft}>
                                <View style={styles.iconCircle}>
                                    <Ionicons
                                        name="power"
                                        size={22}
                                        color={shop.open ? "#fff" : "#1E88E5"}
                                    />
                                </View>

                                <View>
                                    <Text
                                        style={[
                                            styles.openTitle,
                                            { color: shop.open ? "#fff" : "#000" },
                                        ]}
                                    >
                                        {shop.open ? "Close Shop" : "Open Shop"}
                                    </Text>

                                    <Text
                                        style={[
                                            styles.openSub,
                                            { color: shop.open ? "#fff" : "gray" },
                                        ]}
                                    >
                                        {shop.open
                                            ? "Stop receiving new orders"
                                            : "Go live in one tap"}
                                    </Text>
                                </View>
                            </View>

                            <Ionicons
                                name="arrow-forward"
                                size={20}
                                color={shop.open ? "#fff" : "#000"}
                            />
                        </LinearGradient>
                    </TouchableOpacity>
                </LinearGradient>

                {/* 🔥 ACTION CARDS */}
                <View style={styles.row}>
                    <TouchableOpacity
                        style={{ flex: 1 }}
                        onPress={() => navigation.navigate("Orders")}
                    >
                        <LinearGradient colors={["#1E88E5", "#00C6A7"]} style={styles.card}>
                            <Ionicons name="cube-outline" size={22} color="#fff" />
                            <Text style={styles.cardTitle}>View Orders</Text>
                            <Text style={styles.cardSub}>Manage active orders</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{ flex: 1 }}
                        onPress={() => navigation.navigate("Emergency")}
                    >
                        <LinearGradient colors={["#FF6A00", "#FF3D3D"]} style={styles.card}>
                            <Ionicons name="alert-circle-outline" size={22} color="#fff" />
                            <Text style={styles.cardTitle}>Emergency</Text>
                            <Text style={styles.cardSub}>Urgent requests live</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                {/* 🔥 ORDERS */}
                {/* 🔥 ORDERS HEADER */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Active Orders</Text>

                    <TouchableOpacity onPress={() => navigation.navigate("Orders")}>
                        <Text style={styles.viewAll}>View all →</Text>
                    </TouchableOpacity>
                </View>

                {/* 🔥 ORDERS LIST */}
                {orders.length === 0 ? (
                    <Text style={{ textAlign: "center", marginTop: 20 }}>
                        No active orders
                    </Text>
                ) : (
                    orders.map((item, index) => (
                        <View key={index} style={styles.orderCard}>

                            {/* TOP */}
                            <View style={styles.orderTop}>
                                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                                    <Text style={styles.orderId}>
                                        ORD-{item._id.slice(-4)}
                                    </Text>

                                    {/* STATUS BADGE */}
                                    <View
                                        style={[
                                            styles.badge,
                                            item.status === "Pending"
                                                ? styles.pendingBadge
                                                : styles.acceptedBadge,
                                        ]}
                                    >
                                        <Text style={styles.badgeText}>{item.status}</Text>
                                    </View>
                                </View>

                                <Text style={styles.price}>₹{item.total}</Text>
                            </View>

                            {/* ITEMS */}
                            <Text style={styles.orderText}>
                                {item.items?.map((i) => i.name).join(" • ")}
                            </Text>

                            {/* META */}
                            <View style={styles.metaRow}>
                                <Text style={styles.meta}>⏱ 4m ago</Text>
                            </View>

                            {/* 🔥 BUTTONS */}
                            {item.status === "Pending" && (
                                <View style={styles.actions}>

                                    <TouchableOpacity
                                        style={[
                                            styles.acceptBtn,
                                            item.status === "Accepted" && { backgroundColor: "#BDBDBD" }
                                        ]}
                                        onPress={() => acceptOrder(item._id)}
                                        disabled={item.status === "Accepted"}
                                    >
                                        <Text style={styles.btnText}>
                                            {item.status === "Accepted" ? "Accepted" : "Accept"}
                                        </Text>
                                    </TouchableOpacity>

                                </View>
                            )}
                        </View>
                    ))
                )}
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
        paddingHorizontal: 20,
        paddingBottom: 20,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
    },

    smallText: {
        color: "#fff",
        opacity: 0.8,
    },

    title: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#fff",
    },

    subtitle: {
        color: "#fff",
        marginBottom: 10,
    },

    status: {
        color: "#fff",
        marginVertical: 10,
    },

    openCard: {
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    openLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },

    openTitle: {
        fontWeight: "bold",
        fontSize: 16,
    },

    openSub: {
        color: "gray",
        fontSize: 12,
    },

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 15,
        marginTop: 15,
        gap: 15,
    },

    card: {
        flex: 1,
        height: 110,
        borderRadius: 20,
        padding: 15,
        justifyContent: "space-between",
    },

    cardTitle: {
        color: "#fff",
        fontWeight: "bold",
        marginTop: 10,
        fontSize: 16,
    },

    cardSub: {
        color: "#fff",
        fontSize: 12,
        flexWrap: "wrap",
    },

    section: {
        padding: 15,
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
    },

    orderCard: {
        backgroundColor: "#fff",
        borderRadius: 15,
        padding: 15,
        marginTop: 10,
        elevation: 2
    },

    orderTop: {
        flexDirection: "row",
        justifyContent: "space-between",
    },

    orderId: {
        fontWeight: "bold",
    },

    price: {
        fontWeight: "bold",
    },

    orderText: {
        marginVertical: 5,
    },

    meta: {
        color: "gray",
        fontSize: 12,
    },

    actions: {
        flexDirection: "row",
        marginTop: 10,
    },

    acceptBtn: {
        flex: 1,
        padding: 14,
        borderRadius: 30,
        alignItems: "center",
        marginRight: 10,
        backgroundColor: "#1E88E5", // 🔥 ADD THIS
    },

    rejectBtn: {
        backgroundColor: "#eee",
        padding: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        alignItems: "center",
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 15,
        marginTop: 15,
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
    },

    viewAll: {
        color: "#1DA1F2",
        fontWeight: "600",
    },

    orderCard: {
        backgroundColor: "#fff",
        marginHorizontal: 15,
        marginTop: 10,
        padding: 15,
        borderRadius: 20,
        elevation: 3,
    },

    orderTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    orderId: {
        fontWeight: "700",
        fontSize: 16,
    },

    price: {
        fontWeight: "800",
        fontSize: 16,
    },

    orderText: {
        marginVertical: 6,
        color: "#555",
    },

    metaRow: {
        flexDirection: "row",
        marginTop: 5,
    },

    meta: {
        marginRight: 12,
        color: "#777",
        fontSize: 12,
    },

    /* 🔥 BADGES */
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
    },

    pendingBadge: {
        backgroundColor: "#FDE8D7",
    },

    acceptedBadge: {
        backgroundColor: "#D6F5E8",
    },

    badgeText: {
        fontSize: 12,
        fontWeight: "600",
    },

    /* 🔥 BUTTONS */
    actions: {
        flexDirection: "row",
        marginTop: 12,
    },

    rejectBtn: {
        paddingHorizontal: 20,
        justifyContent: "center",
        backgroundColor: "#eee",
        borderRadius: 30,
    },

    btnText: {
        color: "#fff",
        fontWeight: "700",
    },
});