import React, { useState, useCallback } from "react";
import { View, ScrollView, StyleSheet, Text, RefreshControl } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Header from "../components/Header";
import ActionButtons from "../components/ActionButtons";
import PharmacyCard from "../components/PharmacyCard";
import PharmacyDetailScreen from "./PharmacyDetailScreen";
import axios from "axios";
import BASE_URL from "../api/api";

export default function HomeScreen({ navigation, setActive, setSearchQuery, setHideNav }) {
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);


  useFocusEffect(
    useCallback(() => {
      fetchPharmacies();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPharmacies();
    setRefreshing(false);
  };
  // Fetch data
  const fetchPharmacies = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/pharmacies`);
      setPharmacies(res.data);
    } catch (err) {
      console.log("Error fetching pharmacies:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>

      {/* SHOW DETAIL SCREEN */}
      {selectedPharmacy ? (
        <PharmacyDetailScreen
          pharmacy={selectedPharmacy}
          onBack={() => {
            setSelectedPharmacy(null);
            setHideNav(false);
          }}
        />
      ) : (
        <>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <Header setActive={setActive} setSearchQuery={setSearchQuery} />

            <ActionButtons setActive={setActive} />

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Nearby Pharmacies</Text>
            </View>

            {loading ? (
              <Text style={{ textAlign: "center", marginTop: 20 }}>
                Loading pharmacies...
              </Text>
            ) : pharmacies.length === 0 ? (
              <Text style={{ textAlign: "center", marginTop: 20 }}>
                No pharmacies found
              </Text>
            ) : (
              pharmacies.map((item, index) => (
                <PharmacyCard
                  key={index}
                  name={item.name}
                  address={item.address}
                  distance={item.distance}
                  time={item.time}
                  extra={item.open === true ? "Open" : "Closed"}
                  data={item}
                  onOrderPress={(data) => {
                    navigation.navigate("PharmacyDetail", {
                      pharmacy: data,
                    });
                  }}
                />
              ))
            )}

            <View style={styles.mapCard}>
              <Text style={styles.mapIcon}>📍</Text>
              <Text style={styles.mapTitle}>
                {pharmacies.length} pharmacies near you
              </Text>
              <Text style={styles.mapSubtitle}>Tap to explore map</Text>
            </View>
          </ScrollView>
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

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 25,
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
  },

  viewAll: {
    color: "#2196F3",
    fontWeight: "500",
  },

  mapCard: {
    marginHorizontal: 20,
    marginTop: 10,
    padding: 30,
    borderRadius: 20,
    backgroundColor: "#E3F2FD",
    alignItems: "center",
  },

  mapIcon: {
    fontSize: 28,
  },

  mapTitle: {
    fontWeight: "600",
    marginTop: 10,
    fontSize: 15,
  },

  mapSubtitle: {
    color: "#777",
    fontSize: 12,
    marginTop: 4,
  },
});