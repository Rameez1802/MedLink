import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useRoute, useNavigation } from "@react-navigation/native";
import { CartContext } from "../context/CartContext";
import { useToast } from "../components/AppToast";


export default function PharmacyDetailScreen() {
  const [search, setSearch] = useState("");
  const route = useRoute();
  const navigation = useNavigation();
  const { pharmacy } = route.params;
  const { cart, addToCart, increaseQty, decreaseQty } = useContext(CartContext);
  const { showToast } = useToast();

  if (!pharmacy) return null;

  const filtered = pharmacy.medicines.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );
  const total = cart.reduce((sum, item) => sum + item.price * (item.qty || 1), 0);

  return (
    <SafeAreaView style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{pharmacy.name}</Text>
      </View>

      {/* SEARCH */}
      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={20} color="#999" />
        <TextInput
          placeholder="Search medicines in this pharmacy..."
          value={search}
          onChangeText={setSearch}
          style={styles.input}
        />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>



        {/* PHARMACY CARD */}
        <View style={styles.pharmacyCard}>

          <View style={styles.rowBetween}>
            <Text style={styles.pharmacyName}>{pharmacy.name}</Text>

            {/* FIXED OPEN BADGE */}
            <View
              style={[
                styles.openBadge,
                !pharmacy.open && styles.closedBadge
              ]}
            >
              <View
                style={[
                  styles.dot,
                  { backgroundColor: pharmacy.open ? "green" : "red" }
                ]}
              />
              <Text
                style={[
                  styles.openText,
                  { color: pharmacy.open ? "green" : "red" }
                ]}
              >
                {pharmacy.open ? "Open" : "Closed"}
              </Text>
            </View>
          </View>

          <View style={styles.row}>
            <Ionicons name="location-outline" size={16} color="#777" />
            <Text style={styles.metaText}>{pharmacy.address}</Text>
          </View>

          <View style={styles.row}>
            <Ionicons name="navigate-outline" size={16} color="#777" />
            <Text style={styles.metaText}>{pharmacy.distance}</Text>

            <Ionicons
              name="time-outline"
              size={16}
              color="#777"
              style={{ marginLeft: 10 }}
            />
            <Text style={styles.metaText}>{pharmacy.time}</Text>
          </View>
        </View>

        {/* COUNT */}
        <Text style={styles.section}>
          {filtered.length} MEDICINES AVAILABLE
        </Text>

        {/* MEDICINES */}
        {filtered.map((med, i) => {
          const isOut = med.stock === 0; // ✅ FIX
          const id = `${med.name}_${pharmacy.name}`;
          const cartItem = cart.find((c) => c.id === id);

          return (
            <View
              key={i}
              style={[
                styles.card,
                isOut && { opacity: 0.6 }, // optional fade
              ]}
            >

              <Text style={styles.medName}>{med.name}</Text>
              <Text style={styles.subText}>
                {med.description || "Tablets / Capsules"}
              </Text>

              {/* PRICE + STOCK */}
              <View style={styles.rowBetween}>
                <Text style={styles.price}>₹{med.price}</Text>

                <View
                  style={[
                    styles.stockBadge,
                    isOut && styles.outBadgeStyle,
                  ]}
                >
                  <Text
                    style={[
                      styles.stockText,
                      isOut && { color: "red" },
                    ]}
                  >
                    {isOut ? "Out of Stock" : "In Stock"}
                  </Text>
                </View>
              </View>

              {/* MESSAGE */}
              {isOut && (
                <Text style={styles.unavailableText}>
                  Currently unavailable
                </Text>
              )}

              {/* BUTTONS */}
              <View style={styles.btnRow}>

                <TouchableOpacity
                  style={[
                    styles.viewBtn,
                    isOut && { backgroundColor: "#ccc" },
                  ]}
                  disabled={isOut}
                  onPress={() =>
                    navigation.navigate("MedicineDetail", {
                      medicine: med,
                      pharmacy: pharmacy,
                    })
                  }
                  activeOpacity={0.9}
                >
                  <Text style={styles.viewText}>View Details</Text>
                </TouchableOpacity>

                {cartItem ? (
                  // 🔥 QUANTITY UI
                  <View style={styles.qtyContainer}>

                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() => decreaseQty(cartItem)}
                    >
                      <Text style={styles.qtyText}>−</Text>
                    </TouchableOpacity>

                    <Text style={styles.qtyNumber}>{cartItem.qty}</Text>

                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() => increaseQty(cartItem)}
                    >
                      <Text style={styles.qtyText}>+</Text>
                    </TouchableOpacity>

                  </View>
                ) : (
                  // 🔥 ADD BUTTON
                  <TouchableOpacity
                    style={[
                      styles.addBtn,
                      isOut && { borderColor: "#ccc" },
                    ]}
                    disabled={isOut}
                    onPress={() => {
                      addToCart({
                        id: id,
                        name: med.name,
                        price: med.price,
                        pharmacy: pharmacy.name,
                      });

                      showToast("Added to cart!")
                    }}
                  >
                    <Ionicons
                      name="cart-outline"
                      size={16}
                      color={isOut ? "#aaa" : "#1E88E5"}
                    />
                    <Text
                      style={[
                        styles.addText,
                        isOut && { color: "#aaa" },
                      ]}
                    >
                      Add
                    </Text>
                  </TouchableOpacity>
                )}

              </View>
            </View>
          );
        })}

      </ScrollView>
      {cart.length > 0 && (
        <TouchableOpacity
          style={styles.cartBtn}
          activeOpacity={0.9}
          onPress={() => navigation.navigate("Cart")}
        >
          <Ionicons name="cart-outline" size={18} color="#fff" />

          <Text style={styles.cartText}>
            View Cart — ₹{total}.00
          </Text>
        </TouchableOpacity>
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

  searchBox: {
    marginHorizontal: 15,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 25,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  input: {
    flex: 1,
    marginLeft: 10,
  },

  pharmacyCard: {
    backgroundColor: "#fff",
    margin: 15,
    padding: 15,
    borderRadius: 20,
  },

  pharmacyName: {
    fontWeight: "700",
    fontSize: 16,
  },

  openBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E6F4EA",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "green",
    marginRight: 5,
  },

  openText: {
    color: "green",
    fontSize: 12,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },

  metaText: {
    marginLeft: 5,
    color: "#777",
  },

  section: {
    marginHorizontal: 15,
    marginBottom: 10,
    color: "#777",
    fontWeight: "600",
  },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginBottom: 12,
    padding: 15,
    borderRadius: 20,
  },

  medName: {
    fontWeight: "700",
    fontSize: 16,
  },

  subText: {
    color: "#777",
    marginBottom: 5,
  },

  price: {
    fontSize: 18,
    fontWeight: "700",
  },

  stockBadge: {
    backgroundColor: "#E6F4EA",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
  },
  outBadgeStyle: {
    backgroundColor: "#FDECEA",
  },

  stockText: {
    color: "green",
    fontSize: 12,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  btnRow: {
    flexDirection: "row",
    marginTop: 10,
  },

  viewBtn: {
    flex: 1,
    backgroundColor: "#1E88E5",
    padding: 12,
    borderRadius: 25,
    alignItems: "center",
    marginRight: 10,
  },

  viewText: {
    color: "#fff",
    fontWeight: "600",
  },

  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1E88E5",
    paddingHorizontal: 15,
    borderRadius: 25,
    justifyContent: "center",
  },

  addText: {
    color: "#1E88E5",
    marginLeft: 5,
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
    alignItems: "center",
    elevation: 8,
  },

  cartText: {
    color: "#fff",
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "600",
  },
  qtyContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1E88E5",
    borderRadius: 25,
    paddingHorizontal: 10,
  },

  qtyBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  qtyText: {
    fontSize: 16,
    color: "#1E88E5",
    fontWeight: "600",
  },

  qtyNumber: {
    marginHorizontal: 8,
    fontSize: 16,
    fontWeight: "600",
    color: "#1E88E5",
  },
  closedBadge: {
  backgroundColor: "#FDECEA",
},
});