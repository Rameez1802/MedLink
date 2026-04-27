import React, { useState, useEffect, useRef, useContext,useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import axios from "axios";
import BASE_URL from "../api/api";
import { useRoute, useFocusEffect } from "@react-navigation/native";
import { CartContext } from "../context/CartContext";
import { useToast } from "../components/AppToast";

export default function SearchScreen({ navigation }) {
  const route = useRoute();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { cart, addToCart, increaseQty, decreaseQty } = useContext(CartContext);
  const { showToast } = useToast();
  const inputRef = useRef();

  useFocusEffect(
  useCallback(() => {
    if (route.params?.query) {
      searchMedicines(route.params.query);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [route.params?.query])
);

  // 🔍 SEARCH API
  const searchMedicines = async (text) => {
    setQuery(text);

    if (!text.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);

      const res = await axios.get(
        `${BASE_URL}/pharmacies/search/${text}`
      );

      setResults(res.data);
    } catch (err) {
      console.log("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} />
        </TouchableOpacity>

        <Text style={styles.title}>Search Medicines</Text>
      </View>

      {/* SEARCH INPUT */}
      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={20} color="#999" />

        <TextInput
          ref={inputRef}
          placeholder="Search for medicines..."
          value={query}
          onChangeText={searchMedicines}
          style={styles.input}
        />

        <Ionicons name="mic-outline" size={20} color="#999" />
      </View>

      {/* LOADING */}
      {loading && (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      )}

      <ScrollView showsVerticalScrollIndicator={false}>

        {query !== "" && !loading && (
          <>
            <Text style={styles.resultText}>
              Showing results for "{query}"
            </Text>

            {results.length === 0 ? (
              <Text style={{ textAlign: "center", marginTop: 20 }}>
                No results found
              </Text>
            ) : (
              results.map((item, index) => {
                const isOut = item.stock === 0;
                const id = `${item.medicine}_${item.pharmacyName}`;
                const isOpen = item.open === true;
                const cartItem = cart.find((c) => c.id === id);

                return (
                  <View
                    key={index}
                    style={[
                      styles.card,
                      (isOut || !isOpen) && styles.closedCard,
                    ]}
                  >

                    {/* TOP */}
                    <View style={styles.topRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.pharmacy}>
                          {item.pharmacyName}
                        </Text>

                        <Text style={styles.sub}>
                          {item.medicine}
                        </Text>
                      </View>

                      {/* RIGHT SIDE */}
                      <View style={{ alignItems: "flex-end" }}>

                        {/* STATUS BADGE */}
                        <View
                          style={[
                            styles.statusBadge,
                            isOpen ? styles.openBadge : styles.closedBadge,
                          ]}
                        >
                          <View
                            style={[
                              styles.dot,
                              { backgroundColor: isOpen ? "green" : "red" },
                            ]}
                          />
                          <Text
                            style={[
                              styles.statusText,
                              { color: isOpen ? "green" : "red" },
                            ]}
                          >
                            {isOpen ? "Open" : "Closed"}
                          </Text>
                        </View>

                        {/* DISTANCE BELOW BADGE */}
                        <Text style={styles.distance}>
                          {item.distance}{"\n"}
                          <Text style={{ fontWeight: "600" }}>
                            ETA {item.time}
                          </Text>
                        </Text>

                      </View>
                    </View>

                    {/* PRICE + STOCK */}
                    <View style={styles.middleRow}>
                      <Text style={styles.price}>₹{item.price}</Text>

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

                    {/* OUT OF STOCK MESSAGE */}
                    {isOut && (
                      <Text style={styles.unavailableText}>
                        Currently unavailable
                      </Text>
                    )}

                    {/* BUTTONS */}
                    <View style={styles.buttons}>

                      <TouchableOpacity
                        style={[
                          styles.orderBtn,
                          (!isOpen || isOut) && styles.closedBtn,
                        ]}
                        disabled={!isOpen || isOut}
                        onPress={() =>
                          navigation.navigate("MedicineDetail", {
                            medicine: {
                              name: item.medicine,
                              price: item.price,
                              expiry: item.expiry || "2026-12",
                              description:
                                item.description || "No description",
                              stock: item.stock,
                            },
                            pharmacy: {
                              name: item.pharmacyName,
                              address: item.address,
                              distance: item.distance,
                              time: item.time,
                            },
                          })
                        }
                      >
                        <Ionicons
                          name="cart-outline"
                          size={16}
                          color="#fff"
                        />
                        <Text style={styles.orderText}>
                          {isOpen ? "View & Order" : "Closed"}
                        </Text>
                      </TouchableOpacity>

                      {cartItem ? (
                        // QUANTITY CONTROLS
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
                        // ADD BUTTON
                        <TouchableOpacity
                          style={styles.addBtn}
                          disabled={isOut}
                          onPress={() => {
                            addToCart({
                              id: id,
                              name: item.medicine,
                              price: item.price,
                              pharmacy: item.pharmacyName,
                            });

                            showToast("Added to cart!")
                          }}
                        >
                          <Ionicons
                            name="cart-outline"
                            size={16}
                            color={isOut ? "#aaa" : "#1E88E5"}
                          />
                          <Text style={styles.addText}>Add</Text>
                        </TouchableOpacity>
                      )}

                    </View>
                  </View>
                );
              })
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    padding: 15,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 10,
  },

  searchBox: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 25,
    padding: 12,
    alignItems: "center",
    marginBottom: 15,
  },

  input: {
    flex: 1,
    marginHorizontal: 10,
  },

  resultText: {
    color: "#666",
    marginBottom: 10,
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 20,
    marginBottom: 15,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  pharmacy: {
    fontWeight: "700",
    fontSize: 16,
  },

  sub: {
    color: "#777",
    marginTop: 3,
  },

  distance: {
    color: "#777",
    fontSize: 12,
    textAlign: "right",
  },

  middleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  price: {
    fontSize: 20,
    fontWeight: "700",
  },

  stockBadge: {
    marginLeft: 10,
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

  buttons: {
    flexDirection: "row",
    marginTop: 12,
  },

  orderBtn: {
    flex: 1,
    backgroundColor: "#1E88E5",
    padding: 12,
    borderRadius: 25,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginRight: 10,
  },

  orderText: {
    color: "#fff",
    marginLeft: 5,
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

  section: {
    color: "#777",
    fontWeight: "600",
    marginVertical: 10,
  },

  outCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 20,
    marginBottom: 15,
  },

  outTitle: {
    fontWeight: "600",
  },

  outBadge: {
    marginTop: 5,
    backgroundColor: "#FDECEA",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },

  outText: {
    color: "red",
    fontSize: 12,
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
  closedCard: {
    backgroundColor: "#F1F3F5",
    opacity: 0.8,
  },

  closedBtn: {
    backgroundColor: "#B0BEC5",
  },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
    marginBottom: 5,
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