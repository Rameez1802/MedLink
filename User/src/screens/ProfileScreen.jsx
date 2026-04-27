import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";

export default function ProfileScreen({ navigation }) {
  const menu = [
  { title: "My Orders", icon: "bag-outline", screen: "Orders" },
  { title: "Notifications", icon: "notifications-outline", screen: "Notifications" },
  { title: "Settings", icon: "settings-outline", screen: "Settings" },
];

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <LinearGradient
        colors={["#2196F3", "#2EC4B6"]}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        <View style={styles.profileRow}>
          <View style={styles.avatar}>
            <Ionicons name="person-outline" size={30} color="#fff" />
          </View>

          <View style={{ marginLeft: 15 }}>
            <Text style={styles.name}>Tech Morph</Text>
            <Text style={styles.phone}>+91 98765 43210</Text>
          </View>
        </View>
      </LinearGradient>

      {/* MENU LIST */}
      {menu.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.card}
          onPress={() => {
            if (item.screen) {
              navigation.navigate(item.screen);
            }
          }}
        >
          <View style={styles.left}>
            <View style={styles.iconCircle}>
              <Ionicons name={item.icon} size={20} color="#2196F3" />
            </View>
            <Text style={styles.cardText}>{item.title}</Text>
          </View>

          <Ionicons name="chevron-forward" size={20} color="#777" />
        </TouchableOpacity>
      ))}


      {/* LOGOUT */}
      <TouchableOpacity style={styles.logoutCard}>
        <View style={styles.left}>
          <View style={styles.logoutIcon}>
            <Ionicons name="log-out-outline" size={20} color="#E53935" />
          </View>
          <Text style={styles.logoutText}>Logout</Text>
        </View>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },

  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 10,
  },

  profileRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 70,
    height: 70,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },

  name: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },

  phone: {
    color: "#E0F7FA",
    marginTop: 3,
  },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginTop: 15,
    padding: 15,
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 3,
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconCircle: {
    backgroundColor: "#E3F2FD",
    padding: 10,
    borderRadius: 15,
    marginRight: 10,
  },

  cardText: {
    fontWeight: "600",
  },

  switchCard: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginTop: 15,
    padding: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#BBDEFB",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  switchIcon: {
    backgroundColor: "#2EC4B6",
    padding: 10,
    borderRadius: 15,
    marginRight: 10,
  },

  logoutCard: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginTop: 15,
    padding: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#FFCDD2",
  },

  logoutIcon: {
    backgroundColor: "#FFEBEE",
    padding: 10,
    borderRadius: 15,
    marginRight: 10,
  },

  logoutText: {
    color: "#E53935",
    fontWeight: "600",
  },
});