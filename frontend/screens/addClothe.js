import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import axios from "axios";
import { url } from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImageManipulator from "expo-image-manipulator";

const AddItem = ({ route }) => {
  const { imageUri } = route.params;
  const navigation = useNavigation();

  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [season, setSeason] = useState("");
  const [tags, setTags] = useState("");
  const [isValid, setIsValid] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
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
      formData.append("brand", brand);
      formData.append("category", category);
      formData.append("season", season);
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
    if (brand && category && season && tags && imageUri) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [brand, category, season, tags, imageUri]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Profile")} style={styles.comeBack}>
          <Ionicons name="chevron-back-outline" size={35} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.title}>Ajout d'un vêtement</Text>
      </View>
      <KeyboardAwareScrollView style={styles.scrollview} resetScrollToCoords={{ x: 0, y: 0 }} scrollEnabled={true}>
        {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
        <TextInput style={styles.input} onChangeText={setBrand} value={brand} placeholder="Marque" />
        <TextInput style={styles.input} onChangeText={setCategory} value={category} placeholder="Catégorie" />
        <TextInput style={styles.input} onChangeText={setSeason} value={season} placeholder="Saison" />
        <TextInput style={styles.input} onChangeText={setTags} value={tags} placeholder="Tags" />

        <TouchableOpacity onPress={handleSubmit} style={isValid ? styles.submitButton : styles.disabledButton} disabled={!isValid}>
          <Text style={styles.submitText}>{isSubmitting ? "En cours..." : "Valider"}</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    paddingTop: 80,
    alignItems: "center",
    paddingBottom: 20,
  },
  scrollview: {
    flex: 1,
  },
  image: {
    width: "100%",
    height: 400,
    resizeMode: "contain",
    marginTop: 20,
    marginBottom: 20,
  },
  comeBack: {
    position: "absolute",
    top: 77,
    left: 10,
  },
  input: {
    height: 40,
    width: "80%",
    margin: 5,
    borderWidth: 1,
    padding: 10,
    backgroundColor: "white",
    alignSelf: "center",
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
  },
  submitButton: {
    backgroundColor: "black",
    borderRadius: 20,
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
  disabledButton: {
    backgroundColor: "grey",
    borderRadius: 20,
    padding: 15,
    alignSelf: "center",
    alignItems: "center",
    width: "80%",
    marginTop: 20,
    marginBottom: 50,
  },
});

export default AddItem;
