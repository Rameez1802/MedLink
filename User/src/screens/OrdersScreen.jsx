import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import BASE_URL from "../api/api";

export default function OrdersScreen({ navigation }) {
    const [orders, setOrders] = useState([]);
    const [openIndex, setOpenIndex] = useState(null);

    useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 3000);
        return () => clearInterval(interval);
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/orders`);
            setOrders(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    // STATUS LABEL
    const getTopStatus = (status) => {
        if (status === "Pending") return "Order Placed";
        if (status === "Delivered") return "Delivered";
        return "In Progress";
    };

    // STATUS COLOR
    const getBadgeStyle = (status) => {
        if (status === "Delivered") {
            return {
                bg: "#E8F5E9",
                color: "#2E7D32",
            };
        }
        return {
            bg: "#FFF3E0",
            color: "#FB8C00",
        };
    };

    const renderItem = ({ item, index }) => {
        const isOpen = openIndex === index;

        const steps = [
            { key: "Pending", label: "Order Placed" },
            { key: "Confirmed", label: "Confirmed" },
            { key: "Out", label: "Out for Delivery" },
            { key: "Delivered", label: "Delivered" },
        ];

        const currentIndex = steps.findIndex(
            (s) => s.key === item.status
        );

        return (
            <View style={styles.card}>

                {/* HEADER */}
                <TouchableOpacity
                    onPress={() =>
                        setOpenIndex(isOpen ? null : index)
                    }
                >
                    <View style={styles.topRow}>

                        <View
                            style={[
                                styles.statusBadge,
                                { backgroundColor: getBadgeStyle(item.status).bg },
                            ]}
                        >
                            <Text
                                style={{
                                    color: getBadgeStyle(item.status).color,
                                    fontSize: 12,
                                }}
                            >
                                {getTopStatus(item.status)}
                            </Text>
                        </View>

                        <Text style={styles.date}>
                            {new Date(item.createdAt).toDateString()}
                        </Text>

                    </View>

                    <Text style={styles.pharmacy}>
                        HealthPlus Pharmacy
                    </Text>

                    <View style={styles.lastRow}>
                        <Text style={styles.summary}>
                            {item.items.length} items • ₹{item.total}.00
                        </Text>

                        <Ionicons
                            name={isOpen ? "chevron-up" : "chevron-down"}
                            size={20}
                            color="#777"
                        />
                    </View>
                </TouchableOpacity>

                {/* EXPANDED */}
                {isOpen && (
                    <View style={styles.details}>

                        {item.items.map((i, idx) => (
                            <View key={idx} style={styles.rowBetween}>
                                <Text>{i.name} x {i.qty}</Text>
                                <Text style={{ fontWeight: "600" }}>
                                    ₹{i.price * i.qty}.00
                                </Text>
                            </View>
                        ))}

                        <View style={styles.divider} />

                        <View style={styles.rowBetween}>
                            <Text style={{ color: "#777" }}>
                                Delivery Charge
                            </Text>
                            <Text>₹25.00</Text>
                        </View>

                        <View style={styles.rowBetween}>
                            <Text style={styles.total}>Total</Text>
                            <Text style={styles.total}>
                                ₹{item.total}.00
                            </Text>
                        </View>

                        {/* TRACKING */}
                        <Text style={styles.trackingTitle}>
                            ORDER TRACKING
                        </Text>

                        <View style={{ marginTop: 10 }}>
                            {steps.map((step, i) => {
                                const isActive = i === currentIndex;
                                const isCompleted = i < currentIndex;

                                return (
                                    <View key={i} style={styles.trackContainer}>

                                        {/* LINE */}
                                        {i !== steps.length - 1 && (
                                            <View
                                                style={[
                                                    styles.verticalLine,
                                                    (isCompleted || isActive) &&
                                                    styles.activeLine,
                                                ]}
                                            />
                                        )}

                                        {/* DOT */}
                                        <View
                                            style={[
                                                styles.dot,
                                                (isCompleted || isActive) &&
                                                styles.activeDot,
                                            ]}
                                        />

                                        {/* TEXT */}
                                        <Text
                                            style={[
                                                styles.trackText,
                                                (isCompleted || isActive) &&
                                                styles.activeText,
                                            ]}
                                        >
                                            {step.label}
                                        </Text>

                                    </View>
                                );
                            })}
                        </View>

                    </View>
                )}

            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>

            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={22} />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>My Orders</Text>
            </View>

            {orders.length === 0 ? (
                <View style={styles.emptyContainer}>

                    <Ionicons name="receipt-outline" size={70} color="#9AA0A6" />

                    <Text style={styles.emptyTitle}>No Orders Yet</Text>

                    <Text style={styles.emptySubtitle}>
                        You haven't placed any orders yet
                    </Text>

                    <TouchableOpacity
                        style={styles.browseBtn}
                        onPress={() =>
                            navigation.navigate("MainTabs", {
                                screen: "Home",
                            })
                        }
                    >
                        <Text style={styles.browseText}>Start Ordering</Text>
                    </TouchableOpacity>

                </View>
            ) : (
                <FlatList
                    data={orders}
                    keyExtractor={(item) => item._id}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 50 }}
                />
            )}

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F7FA",
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: 15,
    },

    headerTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginLeft: 10,
    },

    card: {
        backgroundColor: "#fff",
        marginHorizontal: 15,
        marginTop: 15,
        padding: 15,
        borderRadius: 20,
        elevation: 2,
    },

    topRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    lastRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 5,
    },

    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
    },

    date: {
        fontSize: 12,
        color: "#777",
    },

    pharmacy: {
        fontSize: 16,
        fontWeight: "700",
        marginTop: 5,
    },

    summary: {
        color: "#777",
    },

    details: {
        marginTop: 15,
    },

    rowBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 4,
    },

    divider: {
        height: 1,
        backgroundColor: "#eee",
        marginVertical: 10,
    },

    total: {
        fontWeight: "700",
    },

    trackingTitle: {
        marginTop: 15,
        fontWeight: "700",
        color: "#777",
    },

    trackContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 12,
        paddingLeft: 5,
    },

    verticalLine: {
        position: "absolute",
        left: 10,
        top: 15,
        width: 2,
        height: 20,
        backgroundColor: "#ccc",
    },

    activeLine: {
        backgroundColor: "#2E7D32",
    },

    dot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: "#ccc",
        marginRight: 10,
    },

    activeDot: {
        backgroundColor: "#2E7D32",
    },

    trackText: {
        color: "#777",
    },

    activeText: {
        color: "#2E7D32",
        fontWeight: "600",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 40,
    },

    emptyTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginTop: 15,
    },

    emptySubtitle: {
        color: "#777",
        marginTop: 6,
        textAlign: "center",
    },

    browseBtn: {
        marginTop: 20,
        backgroundColor: "#1E88E5",
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 25,
    },

    browseText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 15,
    },
});