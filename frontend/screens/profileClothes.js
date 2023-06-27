import React, { useCallback, useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, View, Dimensions, TouchableOpacity, Button, Modal, TouchableHighlight, ScrollView } from "react-native";
import axios from "axios";
import { url } from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const windowWidth = Dimensions.get("window").width;

const ProfileClothes = ({ navigation, ...props }) => {
  const [clothes, setClothes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedSeasons, setSelectedSeasons] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [isCategoriesModalVisible, setCategoriesModalVisible] = useState(false);
  const [isBrandsModalVisible, setBrandsModalVisible] = useState(false);
  const [isSeasonsModalVisible, setSeasonsModalVisible] = useState(false);
  const [isTagsModalVisible, setTagsModalVisible] = useState(false);

  const fetchClothes = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await axios.get(`${url}/clothes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const sortedClothes = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setClothes(sortedClothes);
      setCategories(['All', ...new Set(sortedClothes.map(clothe => clothe.category))]);
      setBrands(['All', ...new Set(sortedClothes.map(clothe => clothe.brand))]);
      setSeasons(['All', ...new Set(sortedClothes.map(clothe => clothe.season))]);
      setTags(['All', ...new Set(sortedClothes.flatMap(clothe => clothe.tags))]);
    } catch (error) {
      console.error(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchClothes();
    }, [])
  );

  const filterByCategory = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const filterByBrand = (brand) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter(b => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  const filterBySeason = (season) => {
    if (selectedSeasons.includes(season)) {
      setSelectedSeasons(selectedSeasons.filter(s => s !== season));
    } else {
      setSelectedSeasons([...selectedSeasons, season]);
    }
  };

  const filterByTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const renderFilterModal = (filterItems, selectedItems, filterByItem, isModalVisible, setModalVisible) => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {filterItems.map((item, index) => (
            <TouchableHighlight
              key={index}
              onPress={() => filterByItem(item)}
              underlayColor="#DDDDDD"
              style={selectedItems.includes(item) ? styles.selectedItem : {}}
            >
              <Text style={styles.label}>{item}</Text>
            </TouchableHighlight>
          ))}
          <Button
            title='Done'
            onPress={() => setModalVisible(false)}
          />
        </View>
      </View>
    </Modal>
  );

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
      <ScrollView horizontal={true} style={styles.scrollContainer}>
        <View style={styles.buttonContainer}>
          <Button
            title='Categories'
            onPress={() => setCategoriesModalVisible(true)}
            color="black"
            style={styles.button}
          />
          <Button
            title='Brands'
            onPress={() => setBrandsModalVisible(true)}
            color="black"
            style={styles.button}
          />
          <Button
            title='Seasons'
            onPress={() => setSeasonsModalVisible(true)}
            color="black"
            style={styles.button}
          />
          <Button
            title='Tags'
            onPress={() => setTagsModalVisible(true)}
            color="black"
            style={styles.button}
          />
        </View>
      </ScrollView>
      {renderFilterModal(categories, selectedCategories, filterByCategory, isCategoriesModalVisible, setCategoriesModalVisible)}
      {renderFilterModal(brands, selectedBrands, filterByBrand, isBrandsModalVisible, setBrandsModalVisible)}
      {renderFilterModal(seasons, selectedSeasons, filterBySeason, isSeasonsModalVisible, setSeasonsModalVisible)}
      {renderFilterModal(tags, selectedTags, filterByTag, isTagsModalVisible, setTagsModalVisible)}
      <FlatList
        data={selectedCategories.includes('All') || selectedCategories.length === 0 ? clothes : clothes.filter(clothe => selectedCategories.includes(clothe.category))}
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
  label: {
    margin: 8,
  },
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: 'rgba(0, 0, 0, 0.4)'
  },
  modalView: {
    width: '100%',
    backgroundColor: "white",
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  selectedItem: {
    backgroundColor: '#DDDDDD',
  },
  scrollContainer: {
    maxHeight: 50,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  button: {
    borderColor: 'black',
    borderWidth: 1,
    margin: 5,
  },
});

export default ProfileClothes;