import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import SplashScreen from "./screens/SplashScreen";
import OpenScreen from "./screens/OpenScreen";
import Login from "./screens/Login";
import Register from "./screens/Register";
import Profile from "./screens/Profile";
import Social from "./screens/Social";
import AddClothe from "./screens/AddClothe";
import ClotheDetails from "./screens/ClotheDetails";
import OutfitDetails from "./screens/OutfitDetails";
import WorkSpace from "./screens/WorkSpace";
import SearchedProfile from "./screens/SearchedProfile";
import FollowersList from "./screens/FollowersList";
import FollowingList from "./screens/FollowingList";
import CreateOutfit from "./screens/CreateOutfit";
import Settings from "./screens/Settings";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator initialRouteName="SplashScreen" screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Social" component={Social} />
      <Tab.Screen name="WorkSpace" component={WorkSpace} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="OpenScreen" component={OpenScreen} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="HomeTabs" component={HomeTabs} options={{ headerShown: false }} />
        <Stack.Screen name="AddClothe" component={AddClothe} />
        <Stack.Screen name="ClotheDetails" component={ClotheDetails} />
        <Stack.Screen name="OutfitDetails" component={OutfitDetails} />
        <Stack.Screen name="SearchedProfile" component={SearchedProfile} />
        <Stack.Screen name="FollowersList" component={FollowersList} />
        <Stack.Screen name="FollowingList" component={FollowingList} />
        <Stack.Screen name="CreateOutfit" component={CreateOutfit} />
        <Stack.Screen name="Settings" component={Settings} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
