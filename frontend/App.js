import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import SplashScreen from "./screens/SplashScreen";
import OpenScreen from "./screens/OpenScreen";
import Login from "./screens/Login";
import Register from "./screens/Register";
import Profile from "./screens/Profile";
import Social from "./screens/Social";
import AddClothe from "./screens/AddClothe";
import AddMultipleClothe from "./screens/AddMultipleClothe";
import ClotheDetails from "./screens/ClotheDetails";
import OutfitDetails from "./screens/OutfitDetails";
import WorkSpace from "./screens/WorkSpace";
import SearchedProfile from "./screens/SearchedProfile";
import FollowersList from "./screens/FollowersList";
import FollowingList from "./screens/FollowingList";
import CreateOutfit from "./screens/CreateOutfit";
import Settings from "./screens/Settings";
import InfosProfileSettings from "./screens/InfosProfileSettings";
import ContactUs from "./screens/ContactUs";
import ReportBug from "./screens/ReportBug";
import AboutUs from "./screens/AboutUs";
import { Ionicons } from "@expo/vector-icons";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function SocialStack() {
  return (
    <Stack.Navigator initialRouteName="SocialScreen" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SocialScreen" component={Social} />
      <Stack.Screen name="SearchedProfile" component={SearchedProfile} />
      <Stack.Screen name="FollowersList" component={FollowersList} />
      <Stack.Screen name="FollowingList" component={FollowingList} />
      <Stack.Screen name="ClotheDetails" component={ClotheDetails} />
    </Stack.Navigator>
  );
}

function WorkSpaceStack() {
  return (
    <Stack.Navigator initialRouteName="WorkSpaceScreen" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="WorkSpaceScreen" component={WorkSpace} />
      <Stack.Screen name="CreateOutfit" component={CreateOutfit} />
      <Stack.Screen name="AddClothe" component={AddClothe} />
      <Stack.Screen name="AddMultipleClothe" component={AddMultipleClothe} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator initialRouteName="ProfileScreen" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileScreen" component={Profile} />
      <Stack.Screen name="ClotheDetails" component={ClotheDetails} />
      <Stack.Screen name="OutfitDetails" component={OutfitDetails} />
      <Stack.Screen name="SearchedProfile" component={SearchedProfile} />
      <Stack.Screen name="FollowersList" component={FollowersList} />
      <Stack.Screen name="FollowingList" component={FollowingList} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="InfosProfileSettings" component={InfosProfileSettings} />
      <Stack.Screen name="ContactUs" component={ContactUs} />
      <Stack.Screen name="ReportBug" component={ReportBug} />
      <Stack.Screen name="AboutUs" component={AboutUs} />
    </Stack.Navigator>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="SocialTab"
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: "#000000",
        tabBarInactiveTintColor: "#A9A9A9",
        tabBarActiveBackgroundColor: "#FFFFFF",
        tabBarInactiveBackgroundColor: "#FFFFFF",
        tabBarShowLabel: false,
        headerShown: false,
        unmountOnBlur: true,
        tabBarIcon: ({ color }) => {
          let iconName;
          if (route.name === "SocialTab") {
            iconName = "home-sharp";
          } else if (route.name === "WorkSpaceTab") {
            iconName = "add-circle-sharp";
          } else if (route.name === "ProfileTab") {
            iconName = "person-sharp";
          }
          return <Ionicons name={iconName} size={35} color={color} />;
        },
      })}
    >
      <Tab.Screen name="SocialTab" component={SocialStack} />
      <Tab.Screen name="WorkSpaceTab" component={WorkSpaceStack} />
      <Tab.Screen name="ProfileTab" component={ProfileStack} />
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
        <Stack.Screen name="Home" component={TabNavigator} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
