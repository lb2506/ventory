import axios from "axios";
import React, { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, View, Dimensions, TouchableOpacity, Text } from "react-native";
import { url } from "../api";
import { useNavigation } from "@react-navigation/native";
import SkeletonClotheOutfit from "../components/skeletonClotheOutfit";
import ListFilterClothes from "../components/listFilterClothes";

const windowWidth = Dimensions.get("window").width;

const SearchedProfileClothes = ({ route }) => {
  const navigation = useNavigation();
  const [clothes, setClothes] = useState([]);
  const [isFetched, setIsFetched] = useState(false);
  const [listClothesShowed, setlistClothesShowed] = useState([]);

  const handleSetClothes = (clothes) => {
    setlistClothesShowed(clothes);
  };

  const fetchClothes = async () => {
    try {
      const response = await axios.get(`${url}/user/clothes/${route.params.userId}`);
      setClothes(response.data);
      setlistClothesShowed(response.data);
      setIsFetched(true);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchClothes();
  }, []);
  const renderItem = ({ item }) => (
    <View style={styles.imageContainer}>
      <TouchableOpacity onPress={() => navigation.navigate("SocialClotheDetails", { item: item })}>
        <Image source={{ uri: item.image }} style={styles.image} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {listClothesShowed.length > 0 && (
        <ListFilterClothes listClothesShowed={listClothesShowed} clothes={clothes} setListClothesShowed={handleSetClothes} />
      )}
      {listClothesShowed.length === 0 && isFetched == false ? <SkeletonClotheOutfit /> : null}
      {listClothesShowed.length === 0 && isFetched && <Text style={styles.noClothesText}>Aucun vêtement.</Text>}
      {listClothesShowed.length > 0 && (
        <FlatList
          data={listClothesShowed}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          numColumns={2}
          style={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  noClothesText: {
    fontSize: 17,
    marginTop: 20,
    marginLeft: 20,
    color: "#bbb",
    fontStyle: "italic",
    height: "100%",
  },
});

export default SearchedProfileClothes;
