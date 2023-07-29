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
import RemoveBgModal from "../components/removeBgModal";

const windowWidth = Dimensions.get("window").width;

function OutfitDetails({ route, navigation }) {
  const { item } = route.params;

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [removeBgVisible, setRemoveBgVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bottomAddClotheSheetVisible, setBottomAddClotheSheetVisible] = useState(false);
  const [visibleBottomSheet, setVisibleBottomSheet] = useState(false);
  const [update, setUpdate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [image, setImage] = useState(item.image);
  const [clothes, setClothes] = useState(item.vetements);
  const [outfitName, setOutfitName] = useState(item.name);
  const [tags, setTags] = useState(item.tags);
  const [tagsArray, setTagsArray] = useState([item.tags]);
  const [valueCat, setValueCat] = useState(item.category);
  const [valueSeason, setValueSeason] = useState(item.season);

  const itemsCat = [
    { label: "Casual", value: "Casual" },
    { label: "Sport", value: "Sport" },
    { label: "Chic", value: "Chic" },
    { label: "Soirée", value: "Soirée" },
    { label: "Travail", value: "Travail" },
    { label: "Autre", value: "Autre" },
  ];

  const itemsSeason = [
    { label: "Hiver", value: "Hiver" },
    { label: "Printemps", value: "Printemps" },
    { label: "Été", value: "Été" },
    { label: "Automne", value: "Automne" },
    { label: "Autre", value: "Autre" },
  ];

  const openBottomAddClotheSheet = () => {
    setBottomAddClotheSheetVisible(true);
  };

  const handleValueCat = (value) => {
    setValueCat(value);
  };
  const handleValueSeason = (value) => {
    setValueSeason(value);
  };
  const handleImage = (value) => {
    console.log(value);
    setImage(value);
  };
  const toggleBottomSheet = () => {
    setVisibleBottomSheet(!visibleBottomSheet);
  };
  const handleSelectedClotheChange = (selectedClothe) => {
    setClothes(selectedClothe);
  };

  const deleteOutfit = async () => {
    setDeleteModalVisible(false);
    const token = await AsyncStorage.getItem("token");

    try {
      await axios.delete(`${url}/deleteOutfit/${item._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      navigation.goBack();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (
      valueCat != item.category ||
      valueSeason != item.season ||
      tagsArray != item.tags ||
      outfitName != item.name ||
      image != item.image ||
      clothes != item.vetements
    ) {
      setUpdate(true);
    } else {
      setUpdate(false);
    }
  }, [valueCat, valueSeason, tagsArray, outfitName, image, clothes]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const listVetementsId = clothes.map((clothe) => clothe._id);
    const strVetementsId = listVetementsId.join(",");
    const token = await AsyncStorage.getItem("token");
    try {
      let formData = new FormData();
      if (image !== item.image) {
        const manipResult = await ImageManipulator.manipulateAsync(image, [{ resize: { width: 720, height: 960 } }], {
          compress: 0.5,
          format: ImageManipulator.SaveFormat.JPEG,
        });
        formData.append("image", {
          uri: manipResult.uri,
          type: "image/jpeg",
          name: "image.jpg",
        });
      }
      formData.append("name", outfitName);
      formData.append("category", valueCat);
      formData.append("season", valueSeason);
      formData.append("tags", tags);
      formData.append("vetements", strVetementsId);

      await axios.post(`${url}/updateOutfit/${item._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      navigation.navigate("Home", {
        screen: "ProfileTab",
        params: { screen: "ProfileScreen" },
      });
    } catch (error) {
      console.error(error.response);
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeBg = async () => {
    const data = new FormData();
    data.append("image", {
      name: "image.jpg",
      type: "image/jpeg",
      uri: Platform.OS === "android" ? image : image.replace("file://", ""),
    });
    setLoading(true);
    await fetch("http://ventory.pythonanywhere.com/remove-background", {
      method: "POST",
      body: data,
    })
      .then((response) => response.blob())
      .then((blob) => {
        var reader = new FileReader();
        reader.onload = () => {
          const imageURI = reader.result;
          setImage(imageURI);
          setLoading(false);
          setRemoveBgVisible(false);
        };
        reader.readAsDataURL(blob);
      })
      .catch((error) => {
        console.error(error);
      });
  };

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
          {image ? (
            <View
              style={{
                position: "absolute",
                bottom: -25,
                right: 90,
                backgroundColor: "white",
                alignItems: "center",
                borderRadius: 50,
                padding: 5,
                paddingLeft: 9,
              }}
            >
              <Ionicons name="cut-sharp" size={35} color="#000000" onPress={() => setRemoveBgVisible(true)} />
            </View>
          ) : null}
          <View
            style={{
              position: "absolute",
              bottom: -25,
              right: 20,
              backgroundColor: "white",
              alignItems: "center",
              borderRadius: 50,
              padding: 5,
              paddingLeft: 9,
            }}
          >
            <Ionicons name="create-sharp" size={35} color="#000000" onPress={openBottomAddClotheSheet} />
          </View>
        </View>
        <View style={styles.containerInputs}>
          <View style={styles.inputs}>
            <Text style={styles.titleInput}>Vêtements:</Text>
            <View style={styles.ClothesContainer}>
              {clothes.map((clothe) => {
                return <Image key={clothe._id} source={{ uri: clothe.image }} style={styles.Clothe} />;
              })}
              <TouchableOpacity onPress={toggleBottomSheet}>
                <View style={styles.ModifyClothe}>
                  <Text style={{ color: "white" }}>Modifier</Text>
                </View>
              </TouchableOpacity>
              <BottomSheet visible={visibleBottomSheet} onBackButtonPress={toggleBottomSheet} onBackdropPress={toggleBottomSheet}>
                <View style={styles.bottomNavigationView}>
                  <Text style={styles.title}>Selectionnez vos vêtements</Text>
                  <ProfileClothes isCreation={true} selectedClothe={clothes} setSelectedClothe={handleSelectedClotheChange} />
                  <TouchableOpacity
                    onPress={() => {
                      toggleBottomSheet();
                    }}
                    style={clothes.length > 0 ? styles.submitButton : styles.disabledButton}
                    disabled={clothes.length > 0 ? false : true}
                  >
                    <Text style={clothes.length > 0 ? styles.submitText : styles.disabledSubmitText}>Valider</Text>
                  </TouchableOpacity>
                </View>
              </BottomSheet>
            </View>
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
            <Tags tags={tags} setTags={setTags} tagsArray={tagsArray} setTagsArray={setTagsArray} />
          </View>
          <Text style={styles.titleInput}>Date de création: {format(new Date(item.date), "dd/MM/yyyy")}</Text>
          {update ? (
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitText}>{isSubmitting ? "En cours..." : "Enregistrer"}</Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity onPress={() => setDeleteModalVisible(true)} style={styles.submitButton}>
            <Text style={styles.submitText}>Supprimer</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <ModalAddPicture
        visible={bottomAddClotheSheetVisible}
        setVisible={setBottomAddClotheSheetVisible}
        isOutfitImage={true}
        setImage={handleImage}
      />
      <ConfirmDeleteModal visible={deleteModalVisible} onConfirm={deleteOutfit} onCancel={() => setDeleteModalVisible(false)} />
      <RemoveBgModal visible={removeBgVisible} onConfirm={removeBg} onCancel={() => setRemoveBgVisible(false)} loading={loading} />
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

export default OutfitDetails;
