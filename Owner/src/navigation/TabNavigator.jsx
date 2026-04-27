import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

import HomeScreen from "../screens/HomeScreen";
import EmergencyScreen from "../screens/EmergencyScreen";
import InventoryScreen from "../screens/InventoryScreen";
import OrdersScreen from "../screens/OrdersScreen"
import ProfileScreen from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    height: 70,
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    position: "absolute",
                },
                tabBarActiveTintColor: "#1E88E5",
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="home-outline" size={20} color={color} />
                    ),
                }}
            />

            <Tab.Screen
                name="Inventory"
                component={InventoryScreen}
                options={{
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="cube-outline" size={20} color={color} />
                    ),
                }}
            />

            <Tab.Screen
                name="Orders"
                component={OrdersScreen}
                options={{
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="receipt-outline" size={20} color={color} />
                    ),
                }}
            />


            <Tab.Screen
                name="Emergency"
                component={EmergencyScreen}
                options={{
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="alert-circle-outline" size={20} color={color} />
                    ),
                }}
            />



            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="person-outline" size={20} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}