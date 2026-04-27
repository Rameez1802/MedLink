import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function BottomNav({ active, setActive }) {
  const tabs = [
    { name: "Home", icon: "home-outline" },
    { name: "Search", icon: "search-outline" },
    { name: "Emergency", icon: "alert-circle-outline" },
    { name: "Blood", icon: "water-outline" },
    { name: "Profile", icon: "person-outline" },
  ];

  return (
    <View style={styles.nav}>
      {tabs.map((tab, index) => {
        const isActive = active === tab.name;

        return (
          <TouchableOpacity
            key={index}
            style={styles.item}
            onPress={() => setActive(tab.name)}
          >
            <Ionicons
              name={tab.icon}
              size={22}
              color={isActive ? "#1E88E5" : "#777"}
            />

            <Text
              style={[
                styles.text,
                { color: isActive ? "#1E88E5" : "#777" },
              ]}
            >
              {tab.name}
            </Text>

            {isActive && <View style={styles.dot} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#eee",
    elevation: 10,
  },

  item: {
    alignItems: "center",
  },

  text: {
    fontSize: 12,
    marginTop: 2,
  },

  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#1E88E5",
    marginTop: 4,
  },
});