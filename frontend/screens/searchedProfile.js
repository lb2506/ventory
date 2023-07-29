import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { url } from "../api";
import axios from "axios";
import jwt_decode from "jwt-decode";

import SearchedProfileClothes from "./SearchedProfileClothes";
import SearchedProfileOutfits from "./SearchedProfileOutfits";
import PhotoPseudo from "../components/photoPseudo";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Tab = createMaterialTopTabNavigator();

const SearchedProfile = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [userData, setUserData] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [nb, setNb] = useState();

  useEffect(() => {
    fetchUserData();
    checkFollow();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${url}/user/${route.params.userId}`);
      const response2 = await axios.get(`${url}/user/${route.params.userId}/nbClothesOutfits`);
      setNb(response2.data);
      setUserData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const checkFollow = async () => {
    const token = await AsyncStorage.getItem("token");
    const decoded = jwt_decode(token);
    const currentUserId = decoded._id;

    const response = await axios.get(`${url}/user/${route.params.userId}`);
    setIsFollowing(response.data.followers.includes(currentUserId));
  };

  const handleFollow = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const decoded = jwt_decode(token);
      const followerId = decoded._id;

      await axios.put(`${url}/user/${route.params.userId}/follow`, {
        followerId: followerId,
      });
      setIsFollowing(!isFollowing);
      await fetchUserData();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{userData && userData.pseudo}</Text>
        <View style={styles.pseudoFollowContainer}>
          <PhotoPseudo pictureSize={70} pseudoSize={20} pseudoName={userData?.pseudo} pictureUrl={userData?.profilePicture} pseudoVisible={false} />
          <View>
            <View style={styles.followersFollowingContainer}>
              <TouchableOpacity style={styles.button} onPress={() => navigation.push("FollowersList", { userId: userData._id })}>
                <Text style={styles.number}>{userData && userData.followers ? userData.followers.length : 0}</Text>
                <Text style={styles.text}>follower(s)</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => navigation.push("FollowingList", { userId: userData._id })}>
                <Text style={styles.number}>{userData && userData.following ? userData.following.length : 0}</Text>
                <Text style={styles.text}>suivie(s)</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.followersFollowingContainer}>
              <View style={styles.button}>
                <Text style={styles.number}>{nb && nb.nbClothes ? nb.nbClothes : 0} </Text>
                <Text style={styles.text}>vêtement(s)</Text>
              </View>
              <View style={styles.button}>
                <Text style={styles.number}>{nb && nb.nbOutfits ? nb.nbOutfits : 0} </Text>
                <Text style={styles.text}>outfit(s)</Text>
              </View>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.followButton} onPress={handleFollow}>
          <Text style={styles.followButtonText}>{isFollowing ? "Ne plus suivre" : "Suivre"}</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.comeBack}>
        <Ionicons name="chevron-back-outline" size={35} color="#000000" />
      </TouchableOpacity>
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
        <Tab.Screen name="Vêtements" component={SearchedProfileClothes} initialParams={{ userId: route.params.userId }} />
        <Tab.Screen name="Outfits" component={SearchedProfileOutfits} initialParams={{ userId: route.params.userId }} />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  comeBack: {
    position: "absolute",
    top: 57,
    left: 10,
  },
  header: {
    display: "flex",
    alignItems: "center",
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  button: {
    marginHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  number: {
    fontSize: 17,
    marginHorizontal: 4,
    fontWeight: "500",
  },
  text: {
    fontSize: 15,
  },
  pseudoFollowContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginTop: 35,
    marginBottom: 15,
  },
  followButton: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  followButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  followersFollowingContainer: {
    flexDirection: "row",
    margin: 10,
  },
});

export default SearchedProfile;
