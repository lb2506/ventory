import React, { useState, useEffect } from "react";
import axios from "axios";
import { url } from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Image, Text, TextInput, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import List from "../components/list";
import Tags from "../components/tags";
import ModalAddPicture from "../components/modalAddPicture";
import * as ImageManipulator from "expo-image-manipulator";
import ConfirmDeleteModal from "../components/confirmDeleteModal";
const windowWidth = Dimensions.get("window").width;

function SocialClotheDetails({ route, navigation }) {
  const { item } = route.params;
  const [image, setImage] = useState(item.image);
  const [brand, setBrand] = useState(item.brand);
  const [tags, setTags] = useState(item.tags);
  const [valueCat, setValueCat] = useState(item.category);
  const [valueSeason, setValueSeason] = useState(item.season);
  const [valueTaille, setValueTaille] = useState(item.size);
  const [valueCouleur, setValueCouleur] = useState(item.color);
  const [dateClothe, setDateClothe] = useState(item.date);

  useEffect(() => {
    if (item.image == null) {
      const fetchClothe = async () => {
        const token = await AsyncStorage.getItem("token");
        try {
          const response = await axios.get(`${url}/clothe/${item}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setImage(response.data.image);
          setBrand(response.data.brand);
          setTags(response.data.tags);
          setValueCat(response.data.category);
          setValueSeason(response.data.season);
          setValueTaille(response.data.size);
          setValueCouleur(response.data.color);
          setDateClothe(response.data.date);
        } catch (error) {
          console.log(error);
        }
      };
      fetchClothe();
    }
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.comeBack}>
          <Ionicons name="chevron-back-outline" size={35} color="#000000" />
        </TouchableOpacity>
        <View style={{ position: "relative", marginTop: 90, borderBottomWidth: 1 }}>
          <Image source={{ uri: image }} style={{ width: windowWidth, height: 400 }} />
        </View>
        <View style={styles.containerInputs}>
          <View style={styles.inputs}>
            <Text style={styles.titleInput}>Marque:</Text>
            <Text style={{ marginLeft: 10 }}>{brand}</Text>
          </View>
          <View style={styles.inputs}>
            <Text style={styles.titleInput}>Catégorie:</Text>
            <Text style={{ marginLeft: 10 }}>{valueCat}</Text>
          </View>
          <View style={styles.inputs}>
            <Text style={styles.titleInput}>Saison:</Text>
            <Text style={{ marginLeft: 10 }}>{valueSeason}</Text>
          </View>
          <View style={styles.inputs}>
            <Text style={styles.titleInput}>Taille:</Text>
            <Text style={{ marginLeft: 10 }}>{valueTaille}</Text>
          </View>
          <View style={styles.inputs}>
            <Text style={styles.titleInput}>Couleur:</Text>
            <Text style={{ marginLeft: 10 }}> {valueCouleur}</Text>
          </View>
          <View style={styles.inputs}>
            <Text style={styles.titleInput}>Tags:</Text>
            <Text style={{ marginLeft: 10 }}>{tags}</Text>
          </View>
          {dateClothe && <Text style={styles.titleInput}>Date de création: {format(new Date(dateClothe), "dd/MM/yyyy")}</Text>}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  containerInputs: {
    marginTop: 50,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 50,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  comeBack: {
    position: "absolute",
    top: 40,
    left: 10,
    zIndex: 1,
  },
  inputs: {
    marginBottom: 30,
    marginRight: 30,
    flexDirection: "row",
  },
  inputsVetements: {
    justifyContent: "space-between",
    flexDirection: "row",
  },
  ClothesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  Clothe: {
    width: 100,
    height: 100,
    marginRight: 10,
    marginBottom: 10,
  },
  titleInput: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 10,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
  },
});

export default SocialClotheDetails;
