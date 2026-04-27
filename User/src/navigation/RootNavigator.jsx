import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigator from "./TabNavigator";
import PharmacyDetailScreen from "../screens/PharmacyDetailScreen";
import MedicineDetailScreen from "../screens/MedicineDetailScreen";
import CartScreen from "../screens/CartScreen"
import CheckoutScreen from "../screens/CheckoutScreen"
import OrderSuccessScreen from "../screens/OrderSuccessScreen"
import OrdersScreen from "../screens/OrdersScreen"
import EmergencyForm from "../screens/EmergencyForm"

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>

            {/* Bottom Tabs */}
            <Stack.Screen name="MainTabs" component={TabNavigator} />

            {/* Detail Screen */}
            <Stack.Screen
                name="PharmacyDetail"
                component={PharmacyDetailScreen}
                options={{
                    animation: "slide_from_right", // 🔥 smooth animation
                }}
            />
            <Stack.Screen
                name="MedicineDetail"
                component={MedicineDetailScreen}
                options={{
                    headerShown: false,
                    animation: "slide_from_right",
                }}
            />
            <Stack.Screen name="Cart" component={CartScreen} />
            <Stack.Screen name="Checkout" component={CheckoutScreen} />
            <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} />
            <Stack.Screen name="Orders" component={OrdersScreen} />
            <Stack.Screen name="EmergencyForm" component={EmergencyForm} />


        </Stack.Navigator>
    );
}