import React, { useState, useEffect, useNavigation } from "react";
import axios from "axios";
import { url } from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Image, Text, TextInput, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImageManipulator from "expo-image-manipulator";

const AddMultipleClothe = ({ route, navigation }) => {
  const [image, setImage] = useState(route.params.images);
  const [isValid, setIsValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const token = await AsyncStorage.getItem("token");

    try {
      for (const imageUri of image) {
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
        formData.append("brand", "");
        formData.append("category", "");
        formData.append("season", "");
        formData.append("size", "");
        formData.append("color", "");
        formData.append("tags", "");

        await axios.post(`${url}/addClothe`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
      }

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
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Ajout multiple</Text>
        </View>
        <View style={styles.containerInputs}>
          <View style={styles.inputs}>
            <Text style={styles.Text}>
              L'ajout multiple permet de créer un vêtement par image. Vous pourrez modifier ses informations dans votre profil après enregistrement.
            </Text>
          </View>
          <View style={styles.ClothesContainer}>
            {image.map((clothe) => {
              return <Image key={clothe._id} source={{ uri: clothe }} style={styles.Clothe} />;
            })}
          </View>
          {isValid ? (
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitText}>{isSubmitting ? "En cours..." : "Enregistrer"}</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </ScrollView>
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
  Text: {
    color: "black",
    fontSize: 15,
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
  title: {
    fontSize: 25,
    fontWeight: "bold",
  },
  titleContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 85,
  },
});

export default AddMultipleClothe;
