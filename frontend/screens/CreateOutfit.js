import React, { useState, useEffect, useCallback } from "react";
import List from "../components/list";
import Tags from "../components/tags";
import { StyleSheet, Text, TouchableOpacity, View, TextInput, Image, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheet } from "react-native-btr";
import ProfileClothes from "./ProfileClothes";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImageManipulator from "expo-image-manipulator";
import { url } from "../api";
import axios from "axios";

const CreateOutfit = () => {
  const navigation = useNavigation();
  const [selectedClothe, setSelectedClothe] = useState([]);
  const [validSelected, setValidSelected] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [outfitName, setOutfitName] = useState("");
  const [tags, setTags] = useState("");
  const [tagsArray, setTagsArray] = useState([]);
  const [valueCat, setValueCat] = useState("");
  const [valueSeason, setValueSeason] = useState("");
  const [visibleBottomSheet, setVisibleBottomSheet] = useState(false);
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

  const handleSelectedClotheChange = (selectedClothe) => {
    setSelectedClothe(selectedClothe);
  };

  const handleValueCat = (value) => {
    setValueCat(value);
  };
  const handleValueSeason = (value) => {
    setValueSeason(value);
  };
  const handleTag = (value) => {
    setTags(value);
  };
  const handleTagsArray = (value) => {
    setTagsArray(value);
  };

  const toggleBottomSheet = () => {
    setVisibleBottomSheet(!visibleBottomSheet);
  };

  useEffect(() => {
    if (imageUri || selectedClothe.length > 0) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [imageUri, selectedClothe]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Désolé, nous avons besoin de la permission d'accès à la galerie pour fonctionner!");
    } else {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        if (result.assets && result.assets.length > 0) {
          setImageUri(result.assets[0].uri);
        }
      }
    }
  };

  const openCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status === "granted") {
        const image = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: false,
          aspect: [4, 3],
          quality: 1,
          exif: true,
        });
        if (!image.canceled) {
          if (image.assets && image.assets.length > 0) {
            setImageUri(image.assets[0].uri);
          }
        }
      } else {
        console.log("La permission d'accès à la caméra a été refusée");
      }
    } catch (error) {
      console.log("Erreur lors de l'ouverture de la caméra :", error);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const listVetementsId = selectedClothe.map((clothe) => clothe._id);
    const strVetementsId = listVetementsId.join(",");
    const token = await AsyncStorage.getItem("token");
    try {
      const manipResult = await ImageManipulator.manipulateAsync(imageUri, [{ resize: { width: 720, height: 960 } }], {
        compress: 0.5,
        format: ImageManipulator.SaveFormat.JPEG,
      });

      let formData = new FormData();
      formData.append("image", {
        uri: manipResult.uri,
        type: "image/jpeg",
        name: "image.jpg",
      });
      formData.append("name", outfitName);
      formData.append("category", valueCat);
      formData.append("season", valueSeason);
      formData.append("tags", tags);
      formData.append("vetements", strVetementsId);

      await axios.post(`${url}/addOutfit`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      navigation.navigate("Profile");
    } catch (error) {
      console.error(error.response);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.comeBack}>
          <Ionicons name="chevron-back-outline" size={35} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.title}>Création d'outfits</Text>
      </View>
      <ScrollView>
        <View style={styles.containerInputs}>
          <View style={styles.inputs}>
            <Text style={styles.titleInput}>Photo de votre outfit:</Text>
            {imageUri != null ? (
              <View>
                <Image source={{ uri: imageUri }} style={{ width: 200, height: 200 }} />
                <TouchableOpacity style={styles.addButton} onPress={() => setImageUri(null)}>
                  <Text style={styles.option}>Supprimer la photo</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.addPictures}>
                <TouchableOpacity style={styles.addButton} onPress={openCamera}>
                  <Text style={styles.option}>Prendre une photo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.addButton} onPress={pickImage}>
                  <Text style={styles.option}>Importer une photo</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          <View style={styles.inputs}>
            <Text style={styles.titleInput}>Vêtements:</Text>
            {}
            <View style={styles.selectedClothesContainer}>
              {selectedClothe.map((clothe) => {
                return <Image key={clothe._id} source={{ uri: clothe.image }} style={styles.selectedClothe} />;
              })}
            </View>
            <View style={styles.addPictures}>
              {/* <TouchableOpacity style={styles.addButton} onPress={pickImage}>
                <Text style={styles.option}>Phototèque</Text>
              </TouchableOpacity> */}
              <TouchableOpacity style={styles.addButton} onPress={toggleBottomSheet}>
                <Text style={styles.option}>Vêtements du profil</Text>
              </TouchableOpacity>
            </View>
            <BottomSheet visible={visibleBottomSheet} onBackButtonPress={toggleBottomSheet} onBackdropPress={toggleBottomSheet}>
              <View style={styles.bottomNavigationView}>
                <Text style={styles.title}>Selectionnez vos vêtements</Text>
                <ProfileClothes isCreation={true} selectedClothe={selectedClothe} setSelectedClothe={handleSelectedClotheChange} />
                <TouchableOpacity
                  onPress={() => {
                    toggleBottomSheet(), setValidSelected(true);
                  }}
                  style={selectedClothe.length > 0 ? styles.submitButton : styles.disabledButton}
                  disabled={selectedClothe.length > 0 ? false : true}
                >
                  <Text style={selectedClothe.length > 0 ? styles.submitText : styles.disabledSubmitText}>Valider</Text>
                </TouchableOpacity>
              </View>
            </BottomSheet>
          </View>
          <View style={styles.inputs}>
            <Text style={styles.titleInput}>Nom de l'outfit:</Text>
            <TextInput style={{ height: 50, borderWidth: 1, paddingLeft: 15 }} onChangeText={(text) => setOutfitName(text)} value={outfitName} />
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
            <Tags tags={tags} setTags={handleTag} tagsArray={tagsArray} setTagsArray={handleTagsArray} />
          </View>
          <TouchableOpacity onPress={handleSubmit} style={isValid ? styles.submitButton : styles.disabledButton} disabled={!isValid}>
            <Text style={isValid ? styles.submitText : styles.disabledSubmitText}>{isSubmitting ? "En cours..." : "Valider"}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    flex: 1,
  },
  containerInputs: {
    marginTop: 50,
    marginLeft: 20,
    marginRight: 20,
  },
  header: {
    display: "flex",
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 20,
  },
  comeBack: {
    position: "absolute",
    top: 57,
    left: 10,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign:'center'
  },
  titleInput: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 10,
  },
  addPictures: {
    width: "100%",
    flexDirection: "row",
  },
  addButton: {
    width: "40%",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    borderWidth: 1,
    marginRight: 10,
    marginTop: 10,
  },
  submitButton: {
    backgroundColor: "black",
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
  inputs: {
    marginBottom: 30,
  },
  bottomNavigationView: {
    backgroundColor: "white",
    width: "100%",
    height: 600,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 50,
    paddingTop: 30,
  },
  selectedClothesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  selectedClothe: {
    width: 100,
    height: 100,
    marginRight: 10,
    marginBottom: 10,
  },
});

export default CreateOutfit;
