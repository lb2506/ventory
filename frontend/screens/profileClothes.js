import React, { useState, useEffect, useCallback } from "react";
import { FlatList, Image, StyleSheet, View, Dimensions, TouchableOpacity, ScrollView, Text } from "react-native";
import axios from "axios";
import { url } from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import Modal from "react-native-modal";
import ListFilterClothes from "../components/listFilterClothes";
import SkeletonClotheOutfit from "../components/skeletonClotheOutfit";

const windowWidth = Dimensions.get("window").width;

const ProfileClothes = ({ navigation, ...props }) => {
  const [clothes, setClothes] = useState([]);
  const [listClothesShowed, setlistClothesShowed] = useState([]);
  const [isFetched, setIsFetched] = useState(false);

  const handleSetClothes = (clothes) => {
    setlistClothesShowed(clothes);
  };

  const fetchClothes = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await axios.get(`${url}/clothes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const sortedClothes = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setClothes(sortedClothes);
      setlistClothesShowed(sortedClothes);
      setIsFetched(true);
    } catch (error) {
      console.error(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchClothes();
    }, [])
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        props.isCreation == true ? selectClothe(item) : navigation.navigate("ClotheDetails", { item: item });
      }}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.image }}
          style={props.isCreation && props.selectedClothe.some((clothe) => clothe._id === item._id) ? [styles.selected, styles.image] : styles.image}
        />
      </View>
    </TouchableOpacity>
  );

  const selectClothe = (item) => {
    const itemId = item._id;

    if (!props.selectedClothe.some((clothe) => clothe._id === itemId)) {
      const updatedSelectedClothe = [...props.selectedClothe, item];
      props.setSelectedClothe(updatedSelectedClothe);
    } else {
      const updatedSelectedClothe = props.selectedClothe.filter((clothe) => clothe._id !== itemId);
      props.setSelectedClothe(updatedSelectedClothe);
    }
  };

  return (
    <View style={props.isCreation ? [styles.container, styles.selectContainer] : styles.container}>
      {listClothesShowed.length > 0 && (
        <ListFilterClothes listClothesShowed={listClothesShowed} clothes={clothes} setListClothesShowed={handleSetClothes} />
      )}
      {listClothesShowed.length === 0 && isFetched == false ? <SkeletonClotheOutfit /> : null}
      {listClothesShowed.length === 0 && isFetched && <Text style={styles.noClothesText}>Vous n'avez pas encore ajouté de vêtement.</Text>}
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
    flex: 1,
  },
  selectContainer: {
    height: 400,
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
  selected: {
    borderWidth: 3,
    borderColor: "black",
  },
  filtersContainer: {
    flexDirection: "row",
  },
  filtersButton: {
    borderColor: "black",
    borderWidth: 1,
    marginRight: 10,
    marginLeft: 1,
    marginVertical: 10,
    padding: 5,
    height: 30,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  noClothesText: {
    fontSize: 17,
    marginTop: 20,
    marginLeft: 20,
    color: "#bbb",
    fontStyle: "italic",
  },
});

export default ProfileClothes;
