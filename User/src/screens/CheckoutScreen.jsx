import React, { useContext, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { CartContext } from "../context/CartContext";
import { useNavigation } from "@react-navigation/native";
import Geolocation from "@react-native-community/geolocation";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import BASE_URL from "../api/api";
import { useToast } from "../components/AppToast";

export default function CheckoutScreen() {
    const { cart } = useContext(CartContext);
    const navigation = useNavigation();
    const [address, setAddress] = useState("");
    const [method, setMethod] = useState("COD");
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();

    // CALCULATIONS
    const subtotal = cart.reduce(
        (sum, item) => sum + item.price * item.qty,
        0
    );

    const delivery = 25;
    const total = subtotal + delivery;

    // 📍 GET CURRENT LOCATION
    const getLocation = () => {
        Geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                setAddress(`Lat: ${latitude}, Lng: ${longitude}`);
                showToast("Location fetched","success")
            },
            (err) => {
                console.log(err);
                showToast("Location error","error")
            }
        );
    };
    const handlePlaceOrder = async () => {
        if (!address.trim()) {
            showToast("Enter address")
            return;
        }

        try {
            setLoading(true);

            const res = await axios.post(`${BASE_URL}/orders/create`, {
                items: cart,
                address,
                paymentMethod: method,
                total,
            });

            setLoading(false);

            navigation.replace("OrderSuccess");

        } catch (err) {
            setLoading(false);
            showToast("Order failed","error")
        }
    };

    return (
        <SafeAreaView style={styles.container}>

            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} >
                    <Ionicons name="arrow-back" size={22} />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Checkout</Text>
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 70 }}>

                {/* ADDRESS */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>DELIVERY ADDRESS</Text>

                    <TextInput
                        placeholder="Enter your delivery address..."
                        value={address}
                        onChangeText={setAddress}
                        style={styles.input}
                    />

                    <TouchableOpacity style={styles.locationBtn} onPress={getLocation}>
                        <Ionicons name="location-outline" size={18} color="#1E88E5" />
                        <Text style={styles.locText}>Use Current Location</Text>
                    </TouchableOpacity>
                </View>

                {/* ORDER ITEMS */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>
                        ORDER ITEMS ({cart.length})
                    </Text>

                    {cart.map((item, i) => (
                        <View key={i} style={styles.rowBetween}>
                            <View>
                                <Text style={styles.itemName}>{item.name}</Text>
                                <Text style={styles.sub}>
                                    {item.qty} x ₹{item.price}
                                </Text>
                            </View>

                            <Text style={styles.price}>
                                ₹{item.price * item.qty}.00
                            </Text>
                        </View>
                    ))}
                </View>

                {/* PAYMENT SUMMARY */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>PAYMENT SUMMARY</Text>

                    <View style={styles.rowBetween}>
                        <Text>Item Total</Text>
                        <Text>₹{subtotal}.00</Text>
                    </View>

                    <View style={styles.rowBetween}>
                        <Text>Delivery Charge</Text>
                        <Text>₹{delivery}.00</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.rowBetween}>
                        <Text style={styles.totalText}>Grand Total</Text>
                        <Text style={styles.totalText}>₹{total}.00</Text>
                    </View>
                </View>

                {/* PAYMENT METHOD */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>PAYMENT METHOD</Text>

                    {[
                        { key: "COD", label: "Cash on Delivery", icon: "cash-outline" },
                        { key: "UPI", label: "UPI Payment", icon: "phone-portrait-outline" },
                        { key: "CARD", label: "Credit/Debit Card", icon: "card-outline" },
                    ].map((item) => (
                        <TouchableOpacity
                            key={item.key}
                            style={[
                                styles.methodBtn,
                                method === item.key && styles.selected,
                            ]}
                            onPress={() => setMethod(item.key)}
                        >
                            <Ionicons
                                name={item.icon}
                                size={20}
                                color={method === item.key ? "#1E88E5" : "#555"}
                                style={{ marginRight: 10 }}
                            />

                            <Text style={{ flex: 1 }}>{item.label}</Text>

                            <Ionicons
                                name={
                                    method === item.key
                                        ? "radio-button-on"
                                        : "radio-button-off"
                                }
                                size={20}
                                color="#1E88E5"
                            />
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>

            {/* PLACE ORDER */}
            <TouchableOpacity
                style={styles.placeBtn}
                disabled={loading}
                onPress={handlePlaceOrder}
            >
                <Text style={styles.placeText}>
                    {loading ? "Placing Order..." : `Place Order — ₹${total}.00`}
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F5F7FA" },

    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: 15,
    },

    headerTitle: {
        fontSize: 20,
        fontWeight: "700",
        marginLeft: 10,
    },

    card: {
        backgroundColor: "#fff",
        margin: 15,
        padding: 15,
        borderRadius: 20,
        elevation: 1.2,
        marginBottom: 2
    },

    sectionTitle: {
        fontWeight: "700",
        marginBottom: 10,
    },

    input: {
        backgroundColor: "#F1F3F5",
        borderRadius: 15,
        padding: 12,
    },

    locationBtn: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
    },

    locText: {
        color: "#1E88E5",
        marginLeft: 5,
    },

    rowBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 6,
    },

    itemName: { fontWeight: "600" },
    sub: { color: "#777" },
    price: { fontWeight: "700" },

    divider: {
        height: 1,
        backgroundColor: "#eee",
        marginVertical: 10,
    },

    totalText: {
        fontWeight: "700",
        fontSize: 16,
    },

    methodBtn: {
        flexDirection: "row",
        alignItems: "center",
        padding: 14,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: "#ddd",
        marginTop: 10,
    },

    selected: {
        borderColor: "#1E88E5",
        backgroundColor: "#E3F2FD",
    },

    placeBtn: {
        position: "absolute",
        bottom: 20,
        left: 15,
        right: 15,
        backgroundColor: "#1E88E5",
        padding: 16,
        borderRadius: 30,
        alignItems: "center",
    },

    placeText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});