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
import ProfileClothes from "./ProfileClothes";
import { BottomSheet } from "react-native-btr";
import ConfirmDeleteModal from "../components/confirmDeleteModal";

const windowWidth = Dimensions.get("window").width;

function OutfitDetails({ route, navigation }) {
  const { item } = route.params;

  const [image, setImage] = useState(item.image);
  const [clothes, setClothes] = useState(item.vetements);
  const [outfitName, setOutfitName] = useState(item.name);
  const [tags, setTags] = useState(item.tags);
  const [tagsArray, setTagsArray] = useState([item.tags]);
  const [valueCat, setValueCat] = useState(item.category);
  const [valueSeason, setValueSeason] = useState(item.season);

  return (
    <View style={styles.container}>
      <ScrollView>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.comeBack}>
          <Ionicons name="chevron-back-outline" size={35} color="#000000" />
        </TouchableOpacity>
        <View style={{ position: "relative", marginTop: 90, borderBottomWidth: 1 }}>
          {image === "" || !image ? (
            <View style={{ width: windowWidth, height: 500, justifyContent: "center", alignItems: "center" }}>
              <Text style={{ fontSize: 20, fontWeight: "bold", color: "black" }}>Aucune image</Text>
            </View>
          ) : (
            <Image source={{ uri: image }} style={{ width: windowWidth, height: 400 }} />
          )}
        </View>
        <View style={styles.containerInputs}>
          <View style={styles.inputs}>
            <Text style={styles.titleInput}>Vêtements:</Text>
            <View style={styles.ClothesContainer}>
              {clothes.map((clothe) => {
                return <Image key={clothe._id} source={{ uri: clothe.image }} style={styles.Clothe} />;
              })}
            </View>
          </View>
          <View style={styles.inputs}>
            <Text style={styles.titleInput}>Nom de l'outfit:</Text>
            <Text style={{ marginLeft: 10 }}>{outfitName}</Text>
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
            <Text style={styles.titleInput}>Tags:</Text>
            <Text style={{ marginLeft: 10 }}>{tags}</Text>
          </View>
          <Text style={styles.titleInput}>Date de création: {format(new Date(item.date), "dd/MM/yyyy")}</Text>
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
  ModifyClothe: {
    width: 80,
    height: 30,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
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

export default OutfitDetails;
