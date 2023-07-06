import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import jwt_decode from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { url } from "../api";
import axios from "axios";

import SettingsBoutton from "../components/settingsButton";
import ModalSettings from "../components/modalSettings";

import ProfileClothes from "./ProfileClothes";
import ProfileOutfits from "./ProfileOutfits";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const Tab = createMaterialTopTabNavigator();

const Profile = () => {
  const navigation = useNavigation();

  const [userData, setUserData] = useState({});
  const [bottomSettingsSheetVisible, setBottomSettingsSheetVisible] = useState(false);

  const openBottomSettingslotheSheet = () => {
    setBottomSettingsSheetVisible(true);
  };

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        const decoded = jwt_decode(token);
        const response = await axios.get(`${url}/user/${decoded._id}`);
        setUserData(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{userData.pseudo}</Text>
        <View style={styles.followersFollowingContainer}>
          <TouchableOpacity onPress={() => navigation.navigate("FollowersList", { userId: userData._id })}>
            <Text>{userData && userData.followers ? userData.followers.length : 0} follower(s)</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("FollowingList", { userId: userData._id })}>
            <Text>{userData && userData.following ? userData.following.length : 0} suivie(s)</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={openBottomSettingslotheSheet} style={styles.settingButton}>
          <Ionicons name="settings-sharp" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: "black",
          tabBarInactiveTintColor: "gray",
          tabBarIndicatorStyle: {
            backgroundColor: "black",
          },
          tabBarStyle: {
            backgroundColor: "#fff",
          },
        }}
      >
        <Tab.Screen name="Mes vêtements" component={ProfileClothes} />
        <Tab.Screen name="Mes outfits" component={ProfileOutfits} />
      </Tab.Navigator>
      <ModalSettings visible={bottomSettingsSheetVisible} setVisible={setBottomSettingsSheetVisible} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    display: "flex",
    alignItems: "flex-start",
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    marginLeft: 10,
  },
  button: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  bottomNavigationView: {
    backgroundColor: "#fff",
    width: "100%",
    height: 250,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: "center",
  },
  followersFollowingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "40%",
    margin: 10,
    marginTop: 20,
  },
  settingButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    right: 25,
    height: 30,
    width: 40,
    marginTop: 60,
  },
});

export default Profile;
