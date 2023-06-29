import React, { useState, useCallback } from "react";
import { FlatList, Image, StyleSheet, View, Dimensions, TouchableOpacity, ScrollView, Text, Button, StatusBar } from "react-native";
import axios from "axios";
import { url } from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import Modal from "react-native-modal";

const windowWidth = Dimensions.get("window").width;

const ProfileClothes = ({ navigation, ...props }) => {
  const [clothes, setClothes] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };


  const fetchClothes = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await axios.get(`${url}/clothes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const sortedClothes = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setClothes(sortedClothes);
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
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.filtersContainer}>
          <TouchableOpacity
            style={styles.filtersButton}
            onPress={toggleModal}
          >
            <Text style={styles.filtersText}>Catégories</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filtersButton}
            onPress={toggleModal}
          >
            <Text style={styles.filtersText}>Marques</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filtersButton}
            onPress={toggleModal}
          >
            <Text style={styles.filtersText}>Saisons</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filtersButton}
            onPress={toggleModal}
          >
            <Text style={styles.filtersText}>Tags</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      <Modal
        onBackdropPress={toggleModal}
        onBackButtonPress={toggleModal}
        isVisible={isModalVisible}
        swipeDirection="down"
        onSwipeComplete={toggleModal}
        // animationIn="bounceInUp"
        // animationOut="bounceOutDown"
        animationInTiming={200}
        animationOutTiming={100}
        backdropTransitionInTiming={300}
        backdropTransitionOutTiming={200}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <View style={styles.center}>
            <View style={styles.barIcon} />
            <Text style={styles.text}>Affichage des filtres</Text>
          </View>
        </View>
      </Modal>
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
  filtersContainer: {
    flexDirection: 'row'
  },

  filtersButton: {
    borderColor: 'black',
    borderWidth: 1,
    marginRight: 10,
    marginLeft: 1,
    marginVertical: 10,
    padding: 5,
    height: 30,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
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
});

export default ProfileClothes;