import React, { useCallback, useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, View, Dimensions, TouchableOpacity } from "react-native";
import axios from "axios";
import { url } from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const windowWidth = Dimensions.get("window").width;

const ProfileClothes = ({ navigation, ...props }) => {
  const [clothes, setClothes] = useState([]);
  const [selectedClothe, setSelectedClothe] = useState([]);

  const fetchClothes = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await axios.get(`${url}/clothes`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setClothes(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchClothes();
    }, [fetchClothes])
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

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        props.isCreation == true ? selectClothe(item) : navigation.navigate("ClotheDetails", { item: item });
      }}
    >
      <View>
        <Image
          source={{ uri: item.image }}
          style={props.isCreation && props.selectedClothe.some((clothe) => clothe._id === item._id) ? [styles.selected, styles.image] : styles.image}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={props.isCreation ? [styles.container, styles.selectContainer] : styles.container}>
      <FlatList
        data={clothes}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        numColumns={3}
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
  selectContainer: {
    height: 400,
  },
  list: {
    backgroundColor: "#FFFFFF",
    height: "100%",
  },
  image: {
    width: windowWidth / 3 - 1.5,
    height: windowWidth / 3 - 1.5,
    margin: 0.75,
  },
  selected: {
    borderWidth: 3,
    borderColor: "black",
  },
});

export default ProfileClothes;
