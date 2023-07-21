import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from "react-native";
import axios from "axios";
import { url } from "../api";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import PhotoPseudo from "../components/photoPseudo";

const FollowingList = ({ route }) => {
  const navigation = useNavigation();
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        const response = await axios.get(`${url}/user/${route.params.userId}/following`);
        setFollowing(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchFollowing();
  }, [route.params.userId]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.comeBack}>
          <Ionicons name="chevron-back-outline" size={35} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.title}>Suivie(s)</Text>
      </View>
      <FlatList
        data={following}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.listItem} onPress={() => navigation.push("SearchedProfile", { userId: item._id })}>
            <Text style={styles.listText}>
              <PhotoPseudo pictureSize={50} pseudoSize={15} pseudoName={item.pseudo} pictureUrl={item.profilePicture} pseudoVisible={true} />
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    flex: 1,
  },
  header: {
    paddingTop: 80,
    alignItems: "center",
    paddingBottom: 20,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  listText: {
    fontSize: 18,
  },
  comeBack: {
    position: "absolute",
    top: 77,
    left: 10,
  },
});

export default FollowingList;
