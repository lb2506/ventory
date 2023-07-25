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
      const sortedClothes = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setClothes(sortedClothes);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchClothes();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.imageContainer}>
      <Image source={{ uri: item }} style={styles.image} />
      <View style={styles.infosDetails}>
        <Text style={[styles.infos, { fontWeight: "bold" }]}>{item.brand}</Text>
        <Text style={styles.infos}>{item.category}</Text>
        <Text style={styles.infos}>{item.season}</Text>
      </View>
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
  infosDetails: {
    paddingBottom: 30,
    paddingHorizontal: 10,
    width: windowWidth / 2 - 1.5,
    height: 100,
  },
  infos: {
    marginBottom: 10,
  },
});

export default SearchedProfileClothes;
