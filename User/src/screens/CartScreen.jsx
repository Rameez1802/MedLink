import React, { useContext } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { CartContext } from "../context/CartContext";
import { useNavigation } from "@react-navigation/native";


export default function CartScreen() {
    const { cart, removeFromCart, increaseQty, decreaseQty } =
        useContext(CartContext);

    const navigation = useNavigation();

    const subtotal = cart.reduce(
        (sum, item) => sum + item.price * item.qty,
        0
    );

    const delivery = 25;
    const total = subtotal + delivery;

    return (
        <View style={styles.container}>

            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={22} />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>My Cart</Text>

                <Text style={styles.items}>{cart.length} items</Text>
            </View>

            {/* EMPTY CART */}
            {cart.length === 0 ? (
                <View style={styles.emptyContainer}>

                    <Ionicons name="cart-outline" size={70} color="#9AA0A6" />

                    <Text style={styles.emptyTitle}>Your cart is empty</Text>

                    <Text style={styles.emptySubtitle}>
                        Search for medicines to add them
                    </Text>

                    <TouchableOpacity
                        style={styles.browseBtn}
                        onPress={() =>
                            navigation.navigate("MainTabs", {
                                screen: "Search",
                            })
                        }
                    >
                        <Text style={styles.browseText}>Browse Medicines</Text>
                    </TouchableOpacity>

                </View>
            ) : (
                <>
                    {/* CART LIST */}
                    <FlatList
                        data={cart}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={{ paddingBottom: 150 }}
                        activeOpacity ={0.9}
                        renderItem={({ item }) => (
                            <View style={styles.card}>

                                {/* DELETE */}
                                <TouchableOpacity
                                    style={styles.deleteBtn}
                                    onPress={() => removeFromCart(item)}
                                >
                                    <Ionicons name="trash-outline" size={18} color="red" />
                                </TouchableOpacity>

                                <Text style={styles.name}>{item.name}</Text>

                                <Text style={styles.sub}>
                                    {item.description || "Tablets / Capsules"} • {item.pharmacy}
                                </Text>

                                <Text style={styles.price}>₹{item.price}.00</Text>

                                {/* QUANTITY */}
                                <View style={styles.qtyRow}>

                                    <View style={styles.qtyControls}>
                                        <TouchableOpacity
                                            style={styles.qtyBtn}
                                            onPress={() => decreaseQty(item)}
                                        >
                                            <Text style={styles.qtyText}>−</Text>
                                        </TouchableOpacity>

                                        <Text style={styles.qtyNumber}>{item.qty}</Text>

                                        <TouchableOpacity
                                            style={styles.qtyBtn}
                                            onPress={() => increaseQty(item)}
                                        >
                                            <Text style={styles.qtyText}>+</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <Text style={styles.each}>
                                        ₹{item.price}.00 each
                                    </Text>

                                </View>
                            </View>
                        )}
                    />

                    {/* FOOTER */}
                    <View style={styles.footer}>

                        <View style={styles.row}>
                            <Text style={styles.label}>Subtotal</Text>
                            <Text style={styles.value}>₹{subtotal}.00</Text>
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.label}>Delivery Charge</Text>
                            <Text style={styles.value}>₹{delivery}.00</Text>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.row}>
                            <Text style={styles.totalText}>Total</Text>
                            <Text style={styles.totalValue}>₹{total}.00</Text>
                        </View>

                        <TouchableOpacity style={styles.checkout} onPress={()=>navigation.navigate("Checkout")}>
                            <Text style={styles.checkoutText}>
                                Proceed to Checkout — ₹{total}.00
                            </Text>
                        </TouchableOpacity>

                    </View>
                </>
            )}
        </View>
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
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 15,
        backgroundColor: "#fff",
    },

    headerTitle: {
        fontSize: 18,
        fontWeight: "700",
    },

    items: {
        color: "#777",
    },

    card: {
        backgroundColor: "#fff",
        marginHorizontal: 15,
        marginTop: 15,
        padding: 18,
        borderRadius: 20,
        elevation: 2,
        position: "relative",   
    },

    deleteBtn: {
        position: "absolute",
        right: 10,
        top: 10,
        backgroundColor: "#FFE5E5",
        padding: 12,
        borderRadius: 12,
        zIndex: 100,        
    },

    name: {
        fontSize: 16,
        fontWeight: "700",
    },

    sub: {
        color: "#777",
        marginTop: 4,
    },

    price: {
        fontSize: 20,
        fontWeight: "700",
        marginTop: 10,
    },

    qtyRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 15,
    },

    qtyControls: {
        flexDirection: "row",
        alignItems: "center",
    },

    qtyBtn: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 6,
    },

    qtyText: {
        fontSize: 16,
        fontWeight: "600",
    },

    qtyNumber: {
        marginHorizontal: 15,
        fontSize: 16,
        fontWeight: "600",
    },

    each: {
        color: "#777",
    },

    footer: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        backgroundColor: "#fff",
        padding: 20,
        borderTopWidth: 1,
        borderColor: "#eee",
    },

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 5,
    },

    label: {
        color: "#777",
    },

    value: {
        color: "#777",
    },

    divider: {
        height: 1,
        backgroundColor: "#eee",
        marginVertical: 10,
    },

    totalText: {
        fontSize: 18,
        fontWeight: "700",
    },

    totalValue: {
        fontSize: 18,
        fontWeight: "700",
    },

    checkout: {
        marginTop: 15,
        backgroundColor: "#1E88E5",
        padding: 16,
        borderRadius: 30,
        alignItems: "center",
    },

    checkoutText: {
        color: "#fff",
        fontSize: 16,
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