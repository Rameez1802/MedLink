import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function PharmacyCard({
    name,
    address,
    distance,
    time,
    extra,
    data,
    onOrderPress,
}) {
    const isOpen = data.open;

    return (
        <View style={[styles.card, !isOpen && styles.closedCard]}>

            {/* 🔝 TOP */}
            <View style={styles.topRow}>
                <Text style={styles.name}>{name}</Text>

                <View
                    style={[
                        styles.statusBadge,
                        data.open ? styles.openBadge : styles.closedBadge,
                    ]}
                >
                    <View
                        style={[
                            styles.dot,
                            { backgroundColor: data.open ? "green" : "red" },
                        ]}
                    />
                    <Text
                        style={[
                            styles.statusText,
                            { color: data.open ? "green" : "red" },
                        ]}
                    >
                        {data.open ? "Open" : "Closed"}
                    </Text>
                </View>
            </View>

            {/* 📍 ADDRESS */}
            <Text style={styles.address}>{address}</Text>

            {/* 📊 INFO */}
            <Text style={styles.info}>
                {distance}  {time}
            </Text>

            {/* 🔘 BUTTONS */}
            <View style={styles.buttons}>

                {/* ORDER BUTTON */}
                <TouchableOpacity
                    style={[
                        styles.orderBtn,
                        !isOpen && styles.closedBtn,
                    ]}
                    onPress={() => onOrderPress(data)}
                    activeOpacity={0.9}
                    disabled={!isOpen}
                >
                    <Text style={styles.orderText}>
                        {isOpen ? "Order Now" : "Closed"}
                    </Text>
                </TouchableOpacity>

                {/* MAP BUTTON */}
                <TouchableOpacity
                    style={styles.mapBtn}
                    activeOpacity={0.9}
                >
                    <Text>View Map</Text>
                </TouchableOpacity>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        marginHorizontal: 20,
        marginBottom: 15,
        padding: 15,
        borderRadius: 18,
        elevation: 4,
    },

    closedCard: {
        backgroundColor: "#F1F3F5",
        opacity: 0.8,
    },

    name: {
        fontSize: 16,
        fontWeight: "700",
    },

    address: {
        color: "#777",
        marginTop: 4,
    },

    info: {
        color: "#999",
        marginTop: 6,
    },

    topRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    open: {
        fontSize: 13,
        fontWeight: "500",
    },

    buttons: {
        flexDirection: "row",
        marginTop: 15,
        alignItems: "center",
    },

    orderBtn: {
        flex: 1,
        backgroundColor: "#1E88E5",
        paddingVertical: 12,
        borderRadius: 25,
        alignItems: "center",
        marginRight: 10,
    },

    closedBtn: {
        backgroundColor: "#B0BEC5",
    },

    orderText: {
        color: "#fff",
        fontWeight: "600",
    },

    mapBtn: {
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: "#ddd",
    },
    statusBadge: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 15,
    },

    openBadge: {
        backgroundColor: "#E6F4EA", 
    },

    closedBadge: {
        backgroundColor: "#FDECEA", 
    },

    statusText: {
        fontSize: 12,
        fontWeight: "600",
    },

    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 5,
    },
});