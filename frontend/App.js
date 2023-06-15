import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import SplashScreen from './screens/splashScreen';
import OpenScreen from './screens/openScreen';
import Login from './screens/login';
import Register from './screens/register';
import Profile from './screens/profile';
import Social from './screens/social';
import AddClothe from './screens/addClothe';
import ClotheDetails from './screens/clotheDetails'
import WorkSpace from './screens/workSpace';
import SearchedProfile from './screens/searchedProfile';


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
          <Stack.Screen name="SearchedProfile" component={SearchedProfile} />
        </Stack.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
  );
}
