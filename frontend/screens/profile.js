import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import jwt_decode from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { url } from "../api";
import axios from "axios";

import ModalSettings from "../components/modalSettings";

import ProfileClothes from "./ProfileClothes";
import ProfileOutfits from "./ProfileOutfits";
import PhotoPseudo from "../components/photoPseudo";
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
        <PhotoPseudo
          pictureSize={70}
          pseudoSize={20}
          pseudoName={userData.pseudo}
          pictureUrl={userData.profilePicture}
          pseudoVisible={true}
        />
        <View style={styles.followersFollowingContainer}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.push("FollowersList", { userId: userData._id })}>
            <Text style={styles.number}>{userData && userData.followers ? userData.followers.length : 0}</Text>
            <Text style={styles.text}>followers</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.push("FollowingList", { userId: userData._id })}>
            <Text style={styles.number}>{userData && userData.following ? userData.following.length : 0}</Text>
            <Text style={styles.text}>suivies</Text>
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
    marginHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  number: {
    fontSize: 17,
    marginHorizontal: 4,
    fontWeight: '500'
  },
  text: {
    fontSize: 15,
  },
  bottomNavigationView: {
    backgroundColor: "#fff",
    width: "100%",
    height: 250,
    justifyContent: "center",
    alignItems: "center",
  },
  followersFollowingContainer: {
    flexDirection: "row",
    width: '100%',
    marginTop: 20,
    justifyContent: 'center',
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
