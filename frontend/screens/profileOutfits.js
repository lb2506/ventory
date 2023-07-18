import React, { useState, useEffect, useCallback } from "react";
import { FlatList, Image, StyleSheet, View, Dimensions, TouchableOpacity, ScrollView, Text } from "react-native";
import axios from "axios";
import { url } from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import ListFilterOutfits from "../components/listFilterOutfits";
import SkeletonClotheOutfit from "../components/skeletonClotheOutfit";
const windowWidth = Dimensions.get("window").width;

const ProfileOutfits = ({ navigation }) => {
  const [outfits, setOutfits] = useState([]);
  const [listOutfitsShowed, setListOutfitsShowed] = useState([]);
  const [isFetched, setIsFetched] = useState(false);

  const handleSetOutfits = (outfits) => {
    setListOutfitsShowed(outfits);
  };

  const fetchOutfits = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await axios.get(`${url}/outfits`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const sortedOutfits = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setOutfits(sortedOutfits);
      setListOutfitsShowed(sortedOutfits);
      setIsFetched(true);
    } catch (error) {
      console.error(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchOutfits();
    }, [])
  );

  const renderItem = ({ item }) => {
    const renderImages = () => {
      const imageSize = {
        width: (windowWidth / 3 - 1.5) / 3,
        height: (windowWidth / 3 - 1.5) / 3,
      };
      const vetements = item.vetements.map((vetement, index) => (
        <View key={index}>
          <Image source={{ uri: vetement.image }} style={imageSize} />
        </View>
      ));
      return (
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            width: windowWidth / 3 - 1.5,
            height: windowWidth / 3 - 1.5,
            margin: 0.75,
          }}
        >
          {vetements}
        </View>
      );
    };

    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("OutfitDetails", { item: item });
        }}
        style={{ display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}
      >
        {item.image && item.image !== "" ? <Image source={{ uri: item.image }} style={styles.image} /> : renderImages()}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {listOutfitsShowed.length !== 0 && (
        <ListFilterOutfits outfits={outfits} listOutfitsShowed={listOutfitsShowed} setListOutfitsShowed={handleSetOutfits} />
      )}
      {listOutfitsShowed.length === 0 && !isFetched && <SkeletonClotheOutfit />}
      {listOutfitsShowed.length === 0 && isFetched && <Text style={styles.noOutfitsText}>Vous n'avez pas encore créé d'outfits.</Text>}
      <FlatList
        data={listOutfitsShowed}
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
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "white",
    paddingTop: 12,
    paddingHorizontal: 12,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    minHeight: 400,
    paddingBottom: 20,
  },
  center: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  barIcon: {
    width: 60,
    height: 5,
    backgroundColor: "#bbb",
    borderRadius: 3,
  },
  text: {
    color: "#bbb",
    fontSize: 24,
    marginTop: 100,
  },
  btnContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: 500,
  },
  noOutfitsText: {
    fontSize: 17,
    marginTop: 20,
    marginLeft: 20,
    color: "#bbb",
    fontStyle: "italic",
  },
});

export default ProfileOutfits;
