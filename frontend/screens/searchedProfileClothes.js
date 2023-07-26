import axios from "axios";
import React, { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, View, Dimensions, TouchableOpacity, Text } from "react-native";
import { url } from "../api";
import { useNavigation } from "@react-navigation/native";

const windowWidth = Dimensions.get("window").width;

const SearchedProfileClothes = ({ route }) => {
  const navigation = useNavigation();
  const [clothes, setClothes] = useState([]);

  const fetchClothes = async () => {
    try {
      const response = await axios.get(`${url}/user/clothes/${route.params.userId}`);
      console.log(response.data);
      setClothes(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchClothes();
  }, []);
  const renderItem = ({ item }) => (
    <View style={styles.imageContainer}>
      <TouchableOpacity onPress={() => navigation.navigate("SocialClotheDetails", { item: item.id })}>
        <Image source={{ uri: item.image }} style={styles.image} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={clothes}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        numColumns={2}
        style={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
  },
  list: {
    backgroundColor: "#EFEFEF",
    height: "100%",
  },
  imageContainer: {
    width: windowWidth / 2 - 1.5,
    margin: 0.75,
    backgroundColor: "#FFFFFF",
  },
  image: {
    width: "100%",
    height: 250,
  },
  infos: {
    marginBottom: 10,
  },
});

export default SearchedProfileClothes;
