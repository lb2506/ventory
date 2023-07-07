import React, { useState, useEffect, useNavigation } from "react";
import axios from "axios";
import { url } from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Image, Text, TextInput, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import List from "../components/list";
import Tags from "../components/tags";
import ModalAddPicture from "../components/modalAddPicture";
import * as ImageManipulator from "expo-image-manipulator";
const windowWidth = Dimensions.get("window").width;

const AddClothe = ({ route, navigation }) => {
  const [bottomAddClotheSheetVisible, setBottomAddClotheSheetVisible] = useState(false);
  const [image, setImage] = useState(route.params.imageUri);
  const [brand, setBrand] = useState("");
  const [tags, setTags] = useState("");
  const [tagsArray, setTagsArray] = useState([]);
  const [valueCat, setValueCat] = useState("");
  const [valueSeason, setValueSeason] = useState("");
  const [itemsCat, setItemsCat] = useState([
    { label: "Casual", value: "Casual" },
    { label: "Sport", value: "Sport" },
    { label: "Chic", value: "Chic" },
    { label: "Soirée", value: "Soirée" },
    { label: "Travail", value: "Travail" },
    { label: "Autre", value: "Autre" },
  ]);
  const [itemsSeason, setItemsSeason] = useState([
    { label: "Hiver", value: "Hiver" },
    { label: "Printemps", value: "Printemps" },
    { label: "Été", value: "Été" },
    { label: "Automne", value: "Automne" },
    { label: "Autre", value: "Autre" },
  ]);
  const [isValid, setIsValid] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleValueCat = (value) => {
    setValueCat(value);
  };
  const handleValueSeason = (value) => {
    setValueSeason(value);
  };
  const handleImage = (value) => {
    setImage(value);
  };
  const openBottomAddClotheSheet = () => {
    setBottomAddClotheSheetVisible(true);
  };
  const handleSubmit = async () => {
    setIsSubmitting(true);
    const token = await AsyncStorage.getItem("token");

    try {
      const manipResult = await ImageManipulator.manipulateAsync(image, [{ resize: { width: 720, height: 960 } }], {
        compress: 0.5,
        format: ImageManipulator.SaveFormat.JPEG,
      });

      let formData = new FormData();
      formData.append("image", {
        uri: manipResult.uri,
        type: "image/jpeg",
        name: "image.jpg",
      });
      formData.append("brand", brand);
      formData.append("category", valueCat);
      formData.append("season", valueSeason);
      formData.append("tags", tags);

      await axios.post(`${url}/addClothe`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      navigation.navigate("Profile");
    } catch (error) {
      console.error(error.response.data);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (image) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [image]);

  return (
    <View style={styles.container}>
      <ScrollView>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.comeBack}>
          <Ionicons name="chevron-back-outline" size={35} color="#000000" />
        </TouchableOpacity>
        <View style={{ position: "relative" }}>
          <Image source={{ uri: image }} style={{ width: windowWidth, height: 500 }} />
          <View style={{ position: "absolute", bottom: 10, right: 10 }}>
            <Ionicons name="create-sharp" size={35} color="#000000" onPress={openBottomAddClotheSheet} />
          </View>
        </View>
        <View style={styles.containerInputs}>
          <View style={styles.inputs}>
            <Text style={styles.titleInput}>Marque:</Text>
            <TextInput style={{ height: 50, borderWidth: 1, paddingLeft: 15 }} onChangeText={(text) => setBrand(text)} value={brand} />
          </View>
          <View style={styles.inputs}>
            <Text style={styles.titleInput}>Catégorie:</Text>
            <List value={valueCat} setValue={handleValueCat} items={itemsCat} />
          </View>
          <View style={styles.inputs}>
            <Text style={styles.titleInput}>Saison:</Text>
            <List value={valueSeason} setValue={handleValueSeason} items={itemsSeason} />
          </View>
          <View style={styles.inputs}>
            <Text style={styles.titleInput}>Tags:</Text>
            <Tags tags={tags} setTags={setTags} tagsArray={tagsArray} setTagsArray={setTagsArray} />
          </View>
          {isValid ? (
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitText}>{isSubmitting ? "En cours..." : "Enregistrer"}</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </ScrollView>
      <ModalAddPicture visible={bottomAddClotheSheetVisible} setVisible={setBottomAddClotheSheetVisible} isOutfitImage={true} setImage={handleImage} />
    </View>
  );
};

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
    top: 80,
    left: 10,
    zIndex: 1,
  },
  inputs: {
    marginBottom: 30,
  },
  inputsVetements: {
    justifyContent: "space-between",
    flexDirection: "row",
  },
  submitButton: {
    backgroundColor: "black",
    padding: 15,
    alignSelf: "center",
    alignItems: "center",
    width: "80%",
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: "white",
    borderColor: "black",
    borderWidth: 1,
    padding: 15,
    alignSelf: "center",
    alignItems: "center",
    width: "80%",
    marginTop: 20,
    marginBottom: 50,
  },
  submitText: {
    color: "#FFFFFF",
    fontSize: 20,
    textAlign: "center",
  },
  disabledSubmitText: {
    color: "black",
    fontSize: 20,
    textAlign: "center",
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
  bottomNavigationView: {
    backgroundColor: "white",
    width: "100%",
    height: 600,
    alignItems: "center",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 50,
    paddingTop: 30,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
  },
});

export default AddClothe;
