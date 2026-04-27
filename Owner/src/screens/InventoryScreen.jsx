import React, { useEffect, useState } from "react";
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, TextInput, Modal
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import axios from "axios";
import BASE_URL from "../api/api";
import { getUserPhone } from "../store/userStore";
import LinearGradient from "react-native-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function InventoryScreen() {
const insets = useSafeAreaInsets();
  const phone = String(getUserPhone());

  const [medicines, setMedicines] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingMed, setEditingMed] = useState(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    expiry: "",
  });

  // 🔥 FETCH MEDICINES
  const fetchMedicines = async () => {
    const res = await axios.get(`${BASE_URL}/owner/${phone}`);
    setMedicines(res.data.medicines || []);
    setFiltered(res.data.medicines || []);
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  // 🔥 SEARCH (STARTS WITH FIX)
  const handleSearch = (text) => {
    setFiltered(
      medicines.filter((m) =>
        m.name.toLowerCase().startsWith(text.toLowerCase())
      )
    );
  };

  // 🔥 ADD / EDIT
  const saveMedicine = async () => {
    const payload = {
      name: form.name,
      price: Number(form.price),
      stock: Number(form.stock),
      expiry: form.expiry,
    };

    let res;

    if (editingMed) {
      res = await axios.put(
        `${BASE_URL}/owner/medicine/${phone}/${editingMed._id}`,
        payload
      );
    } else {
      res = await axios.post(
        `${BASE_URL}/owner/medicine/${phone}`,
        payload
      );
    }

    setMedicines(res.data);
    setFiltered(res.data);

    // RESET
    setModalVisible(false);
    setEditingMed(null);
    setForm({ name: "", price: "", stock: "", expiry: "" });
  };

  // 🔥 DELETE
  const deleteMedicine = async (id) => {
    const res = await axios.delete(
      `${BASE_URL}/owner/medicine/${phone}/${id}`
    );

    setMedicines(res.data);
    setFiltered(res.data);
  };

  // 🔥 OPEN EDIT
  const openEdit = (item) => {
    setEditingMed(item);
    setForm(item);
    setModalVisible(true);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.name}>{item.name}</Text>

        <TouchableOpacity onPress={() => openEdit(item)}>
          <Ionicons name="pencil-outline" size={20} />
        </TouchableOpacity>
      </View>

      <View style={styles.bottom}>
        <View style={styles.bottomRow}>
          <Text style={styles.price}>₹{item.price}</Text>
          <Text style={styles.stock}>{item.stock} left</Text>
          <Text style={styles.exp}>Exp {item.expiry}</Text>
        </View>

        <TouchableOpacity onPress={() => deleteMedicine(item._id)}>
          <Ionicons name="trash-outline" size={20} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>

      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Inventory</Text>
          <Text style={styles.subtitle}>{filtered.length} medicines</Text>
        </View>

        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.addText}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* SEARCH */}
      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={20} color="gray" />
        <TextInput
          placeholder="Search medicines"
          onChangeText={handleSearch}
          style={{ marginLeft: 10, flex: 1 }}
        />
      </View>

      {/* LIST */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
      />

      {/* MODAL */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modal}>
          <View style={styles.modalBox}>

            <Text style={styles.modalTitle}>
              {editingMed ? "Edit medicine" : "Add medicine"}
            </Text>

            <TextInput
              placeholder="Name"
              value={form.name}
              onChangeText={(t) => setForm({ ...form, name: t })}
              style={styles.input}
            />

            <TextInput
              placeholder="Price"
              value={form.price}
              onChangeText={(t) => setForm({ ...form, price: t })}
              style={styles.input}
              keyboardType="numeric"
            />

            <TextInput
              placeholder="Stock"
              value={form.stock}
              onChangeText={(t) => setForm({ ...form, stock: t })}
              style={styles.input}
              keyboardType="numeric"
            />

            <TextInput
              placeholder="Expiry"
              value={form.expiry}
              onChangeText={(t) => setForm({ ...form, expiry: t })}
              style={styles.input}
            />

            <TouchableOpacity onPress={saveMedicine}>
              <LinearGradient
                colors={["#1E88E5", "#2EC4B6"]}
                style={styles.saveBtn}
              >
                <Text style={{ color: "#fff" }}>
                  {editingMed ? "Save" : "Add medicine"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={{ textAlign: "center", marginTop: 10 }}>
                Cancel
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F8",
    padding: 15,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
  },

  subtitle: {
    color: "gray",
  },

  addBtn: {
    flexDirection: "row",
    backgroundColor: "#1E88E5",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: "center",
  },

  addText: {
    color: "#fff",
    marginLeft: 5,
  },

  searchBox: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 20,
    marginVertical: 15,
    alignItems: "center",
  },

  card: {
    backgroundColor: "#ffffff", // 
    borderRadius: 25,
    padding: 18,
    marginBottom: 15,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 5,
  },

  iconColumn: {
    justifyContent: "space-between",
    alignItems: "center",
  },

  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1C2B33",
  },
  bottom: {
    flexDirection: "row",
    justifyContent: "space-between"
  },

  bottomRow: {
    flexDirection: "row",
    gap: 20,
  },

  price: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#1C2B33",
  },

  stock: {
    color: "#6B7C87",
    fontSize: 16,
  },

  exp: {
    color: "#6B7C87",
    fontSize: 16,
  },
  modal: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
  },

  modalBox: {
    backgroundColor: "#fff",
    margin: 20,
    borderRadius: 25,
    padding: 20,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  input: {
    backgroundColor: "#F1F3F5",
    padding: 12,
    borderRadius: 15,
    marginTop: 10,
  },

  saveBtn: {
    marginTop: 15,
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
  },
  modal: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
  },

  modalBox: {
    backgroundColor: "#fff",
    margin: 20,
    borderRadius: 25,
    padding: 20,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  input: {
    backgroundColor: "#F1F3F5",
    padding: 12,
    borderRadius: 15,
    marginTop: 10,
  },

  saveBtn: {
    marginTop: 15,
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
  },
});