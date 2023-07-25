import React, { useState } from "react";
import axios from "axios";
import { View, Text, TouchableOpacity, Alert, StyleSheet, Switch, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Input } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { url } from "../api";
import { Ionicons } from "@expo/vector-icons";
import * as ImageManipulator from "expo-image-manipulator";
import PhotoPseudo from "../components/photoPseudo";
import ModalAddPicture from "../components/modalAddPicture";

const Register = () => {
  const [pseudo, setPseudo] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [bottomAddClotheSheetVisible, setBottomAddClotheSheetVisible] = useState(false);
  const [profilePicture, setProfilePicture] = useState("/Users/leo/Desktop/Clients/ventory/frontend/assets/avatar.png");

  const navigation = useNavigation();

  const handleSubmit = async () => {
    if (pseudo.length === 0) {
      Alert.alert("Erreur", "Veuillez choisir un pseudo");
      return;
    }

    if (firstName.length === 0 || lastName.length === 0) {
      Alert.alert("Erreur", "Remplir le prénom et le nom");
      return;
    }

    const emailPattern = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    if (!emailPattern.test(email)) {
      Alert.alert("Erreur", "Format de l'adresse e-mail invalide.");
      return;
    }

    if (phone.length !== 10 || !/^\d+$/.test(phone)) {
      Alert.alert("Erreur", "Le numéro de téléphone doit contenir 10 chiffres.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Erreur", "Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Erreur", "Les mots de passe ne correspondent pas.");
      return;
    }

    if (!termsAccepted) {
      Alert.alert("Erreur", "Vous devez accepter les conditions d'utilisation et de confidentialité.");
      return;
    }

    try {
      const manipResult = await ImageManipulator.manipulateAsync(profilePicture, [{ resize: { width: 360, height: 480 } }], {
        compress: 0.5,
        format: ImageManipulator.SaveFormat.JPEG,
      });

      let formData = new FormData();
      formData.append("profilePicture", {
        uri: manipResult.uri,
        type: "image/jpeg",
        name: "profile.jpg",
      });

      formData.append("pseudo", pseudo);
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email.toLowerCase());
      formData.append("phone", phone);
      formData.append("password", password);

      const response = await axios.post(`${url}/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      await AsyncStorage.setItem("token", response.data.token);
      navigation.navigate("Home");
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error);
        setTermsAccepted(false);
      } else {
        setErrorMessage("Une erreur est survenue lors de la connexion, veuillez essayer à nouveau");
      }
    }
  };

  const openBottomAddClotheSheet = () => {
    setBottomAddClotheSheetVisible(true);
  };

  const handleImage = (value) => {
    setProfilePicture(value);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Inscription</Text>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate("OpenScreen")} style={styles.comeBack}>
        <Ionicons name="chevron-back-outline" size={35} color="#000000" />
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.formContainer}>
        <View style={styles.photoPseudo}>
          <PhotoPseudo
            pictureSize={150}
            pseudoSize={20}
            // pseudoName={userData?.pseudo}
            pictureUrl={profilePicture}
            pseudoVisible={false}
          />
          <TouchableOpacity style={styles.editIconContainer}>
            <View style={styles.editIcon}>
              <Ionicons name="add-outline" size={19} color="#FFFFFF" onPress={openBottomAddClotheSheet} />
            </View>
          </TouchableOpacity>
        </View>
        <Input placeholder="Pseudo" value={pseudo} onChangeText={setPseudo} />
        <Input placeholder="Prénom" value={firstName} onChangeText={setFirstName} />
        <Input placeholder="Nom" value={lastName} onChangeText={setLastName} />
        <Input placeholder="Adresse e-mail" value={email} onChangeText={setEmail} />
        <Input placeholder="Téléphone" value={phone} onChangeText={setPhone} />
        <Input placeholder="Mot de passe" value={password} onChangeText={setPassword} secureTextEntry />
        <Input placeholder="Confirmer le mot de passe" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
        <View style={styles.terms}>
          <Switch style={{ marginRight: 10 }} value={termsAccepted} onValueChange={setTermsAccepted} />
          <Text>J'accepte les conditions d'utilisation et de confidentialité.</Text>
        </View>
        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
        <TouchableOpacity onPress={handleSubmit} style={styles.button}>
          <Text style={styles.buttonText}>Continuer</Text>
        </TouchableOpacity>
      </ScrollView>
      <ModalAddPicture
        visible={bottomAddClotheSheetVisible}
        setVisible={setBottomAddClotheSheetVisible}
        isOutfitImage={true}
        isProfilePicture={false}
        setImage={handleImage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    flex: 1,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
  },
  comeBack: {
    position: "absolute",
    top: 57,
    left: 10,
  },
  formContainer: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  terms: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 50,
    marginTop: 20,
    width: "100%",
  },
  button: {
    backgroundColor: "#000000",
    padding: 10,
    alignItems: "center",
    width: "80%",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  error: {
    color: "red",
  },
  photoPseudo: {
    alignItems: "center",
    marginVertical: 30,
  },
  editIconContainer: {
    position: "absolute",
    bottom: 5,
  },
  editIcon: {
    backgroundColor: "black",
    borderRadius: 20,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Register;
