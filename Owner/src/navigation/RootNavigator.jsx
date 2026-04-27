import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigator from "./TabNavigator";
import Login from "../screens/Login"
import SignUp from "../screens/Signup"
import OTP from "../screens/OTP"
const Stack = createNativeStackNavigator();

export default function RootNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>

            <Stack.Screen name= "Login" component={Login}/>
            <Stack.Screen name= "SignUp" component={SignUp}/>
            <Stack.Screen name= "OTP" component={OTP}/>
            {/* Bottom Tabs */}
            <Stack.Screen name="MainTabs" component={TabNavigator} />


        </Stack.Navigator>
    );
}