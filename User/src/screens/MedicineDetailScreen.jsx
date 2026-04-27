import React, { useState, useContext } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import { CartContext } from "../context/CartContext";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useToast } from "../components/AppToast";

export default function MedicineDetailScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const { medicine, pharmacy } = route.params;
    const [qty, setQty] = useState(1);
    const total = medicine.price * qty;
    const { addToCart } = useContext(CartContext);
    const { showToast } = useToast();

    return (
        <SafeAreaView style={styles.container}>

            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backBtn}
                >
                    <Ionicons name="arrow-back" size={22} color="#000" />
                </TouchableOpacity>

                <Text style={styles.title}>Medicine Details</Text>
            </View>

            {/* Top Card */}
            <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>

                <View style={styles.topCard}>

                    <View style={styles.topRow}>
                        <View style={styles.iconBox}>
                            <Ionicons name="medkit-outline" size={32} color="#1E88E5" />
                        </View>

                        <View style={{ marginLeft: 15 }}>
                            <Text style={styles.medName}>{medicine.name}</Text>
                            <Text style={styles.sub}>500mg tablets</Text>
                        </View>
                    </View>

                </View>

                {/* GRID */}
                <View style={styles.grid}>

                    <View style={styles.box}>
                        <Text style={styles.label}>PRICE</Text>
                        <Text style={styles.value}>₹{medicine.price}</Text>
                    </View>

                    <View style={styles.box}>
                        <Text style={styles.label}>AVAILABILITY</Text>
                        <Text style={styles.green}>In Stock</Text>
                    </View>

                    <View style={styles.box}>
                        <Text style={styles.label}>EXPIRY DATE</Text>
                        <Text style={styles.value}>{medicine.expiry}</Text>
                    </View>

                    <View style={styles.box}>
                        <Text style={styles.label}>PHARMACY</Text>
                        <Text style={styles.value}>{pharmacy.name}</Text>
                    </View>
                </View>

                {/* DESCRIPTION */}
                <View style={styles.bigBox}>
                    <Text style={styles.label}>DESCRIPTION</Text>
                    <Text style={styles.desc}>
                        {medicine.description || "No description"}
                    </Text>
                </View>

                {/* AVAILABLE */}
                <View style={styles.bigBox}>
                    <Text style={styles.label}>AVAILABLE AT</Text>

                    <Text style={styles.pharmacy}>{pharmacy.name}</Text>
                    <Text style={styles.meta}>{pharmacy.address}</Text>
                    <Text style={styles.meta}>
                        {pharmacy.distance} • ETA {pharmacy.time}
                    </Text>
                </View>

                {/* QUANTITY */}
                <View style={styles.qtyBox}>
                    <Text style={styles.label}>SELECT QUANTITY</Text>

                    <View style={styles.qtyRow}>
                        <TouchableOpacity
                            onPress={() => setQty(Math.max(1, qty - 1))}
                            style={styles.qtyBtn}
                        >
                            <Text style={{ fontSize: 18 }}>-</Text>
                        </TouchableOpacity>

                        <Text style={styles.qty}>{qty}</Text>

                        <TouchableOpacity
                            onPress={() => setQty(qty + 1)}
                            style={styles.qtyBtn}
                        >
                            <Text style={{ fontSize: 18 }}>+</Text>
                        </TouchableOpacity>

                        <Text style={styles.total}>₹{total}.00</Text>
                    </View>
                </View>
            </ScrollView>

            {/* ADD TO CART */}
            <TouchableOpacity
                style={styles.cartBtn}
                activeOpacity={0.9}
                onPress={() => {
                    addToCart({
                        id: `${medicine.name}_${pharmacy.name}`,
                        name: medicine.name,
                        price: medicine.price,
                        pharmacy: pharmacy.name,
                        qty: qty, // 
                    });

                    showToast("Added to cart!")
                }}
            >
                <Ionicons name="cart-outline" size={18} color="#fff" />
                <Text style={styles.cartText}>
                    Add to Cart — ₹{total}.00
                </Text>
            </TouchableOpacity>
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
        paddingHorizontal: 15,
        paddingVertical: 12,
    },

    backBtn: {
        padding: 8, // bigger touch area
    },
    topRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    title: {
        fontSize: 20,
        fontWeight: "700",
        marginLeft: 10,
    },

    topCard: {
        backgroundColor: "#fff",
        margin: 15,
        padding: 20,
        borderRadius: 20,
    },

    iconBox: {
        backgroundColor: "#E3F2FD",
        width: 65,
        height: 65,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
    },

    medName: {
        fontSize: 24, // bigger
        fontWeight: "700",
    },

    sub: {
        color: "#777",
        fontSize: 15,
    },

    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        paddingHorizontal: 10,
    },

    box: {
        width: "45%",
        backgroundColor: "#fff",
        margin: 10,
        padding: 15,
        borderRadius: 15,
    },

    label: {
        color: "#777",
        fontSize: 12,
    },

    value: {
        fontWeight: "700",
        marginTop: 5,
        fontSize: 16,
    },

    green: {
        color: "green",
        marginTop: 5,
        fontSize: 16,
    },

    bigBox: {
        backgroundColor: "#fff",
        margin: 15,
        padding: 15,
        borderRadius: 15,
    },

    desc: {
        marginTop: 5,
        fontSize: 15,
    },

    pharmacy: {
        fontWeight: "700",
        marginTop: 5,
        fontSize: 16,
    },

    meta: {
        color: "#777",
        fontSize: 14,
    },

    qtyBox: {
        backgroundColor: "#fff",
        margin: 15,
        padding: 15,
        borderRadius: 15,
    },

    qtyRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
    },

    qtyBtn: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 12,
        borderRadius: 10,
    },

    qty: {
        marginHorizontal: 15,
        fontSize: 20,
        fontWeight: "600",
    },

    total: {
        marginLeft: "auto",
        fontWeight: "700",
        fontSize: 18,
    },

    cartBtn: {
        position: "absolute",
        bottom: 20,
        left: 15,
        right: 15,
        backgroundColor: "#1E88E5",
        padding: 16,
        borderRadius: 30,
        flexDirection: "row",
        justifyContent: "center",
    },

    cartText: {
        color: "#fff",
        marginLeft: 8,
        fontSize: 16,
        fontWeight: "600",
    },
});