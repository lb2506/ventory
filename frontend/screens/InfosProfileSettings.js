import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Alert, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';
import axios from "axios";
import { url } from "../api";
import * as ImageManipulator from "expo-image-manipulator";

import PhotoPseudo from "../components/photoPseudo";
import ModalAddPicture from "../components/modalAddPicture";


const InfosProfileSettings = ({ route }) => {
    const navigation = useNavigation()

    const [pseudo, setPseudo] = useState("")
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [userData, setUserData] = useState(null);
    const [profilePicture, setProfilePicture] = useState(null);
    const [bottomAddClotheSheetVisible, setBottomAddClotheSheetVisible] = useState(false);



    const openBottomAddClotheSheet = () => {
        setBottomAddClotheSheetVisible(true);
    };

  useEffect(() => {
    if (route.params?.imageUri) {
      setProfilePicture(route.params.imageUri);
    }
  }, [route.params?.imageUri]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          const decoded = jwt_decode(token);
          const response = await axios.get(`${url}/user/${decoded._id}`);
          setUserData(response.data);
          setProfilePicture(response.data.profilePicture);
          setPseudo(response.data.pseudo);
          setLastName(response.data.lastName);
          setFirstName(response.data.firstName);
          setEmail(response.data.email);
          setPhone(response.data.phone);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserData();
  }, []);

  const handlePasswordChange = (text) => {
    setPassword(text);
    if (text === "") {
      setConfirmPassword("");
    }
  };

    const handleSubmit = async () => {
        if (password !== confirmPassword) {
            Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
            return;
        }
        if (password.length > 0 && password.length < 6) {
            Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères.');
            return;
        }
        if (phone.length !== 10 || !/^\d+$/.test(phone)) {
            Alert.alert('Erreur', 'Le numéro de téléphone doit contenir 10 chiffres.');
            return;
        }
        setIsSubmitting(true);
        try {
            const token = await AsyncStorage.getItem("token");
            if (token) {
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
                formData.append("email", email);
                formData.append("phone", phone);
                formData.append("password", password);

                const decoded = jwt_decode(token);
                await axios.put(`${url}/user/${decoded._id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`,
                    }
                });
                navigation.goBack()
            }
        } catch (error) {
            console.log(error);
            setIsSubmitting(false);
        }
    };


    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <ScrollView>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.comeBack}>
                            <Ionicons name="chevron-back-outline" size={35} color="#000000" />
                        </TouchableOpacity>
                        <Text style={styles.title}>Informations du profil</Text>
                    </View>
                    <View style={styles.photoPseudo}>
                        <PhotoPseudo
                            pictureSize={150}
                            pseudoSize={20}
                            pseudoName={userData?.pseudo}
                            pictureUrl={profilePicture}
                            pseudoVisible={false}
                        />
                        <TouchableOpacity style={styles.editIconContainer}>
                            <View style={styles.editIcon} >
                                <Ionicons name="add-outline" size={19} color="#FFFFFF" onPress={openBottomAddClotheSheet} />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.formContainer}>
                        <TextInput
                            style={styles.input}
                            value={pseudo}
                            onChangeText={setPseudo}
                            placeholder="Pseudo"
                        />
                        <TextInput
                            style={styles.input}
                            value={lastName}
                            onChangeText={setLastName}
                            placeholder="Nom"
                        />
                        <TextInput
                            style={styles.input}
                            value={firstName}
                            onChangeText={setFirstName}
                            placeholder="Prénom"
                        />
                        <TextInput
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Adresse email"
                        />
                        <TextInput
                            style={styles.input}
                            value={phone}
                            onChangeText={setPhone}
                            placeholder="Numéro de téléphone"
                        />
                        <TextInput
                            style={styles.input}
                            value={password}
                            onChangeText={handlePasswordChange}
                            placeholder="Mot de passe"
                            secureTextEntry={true}
                            passwordRules=""
                        />
                        {password !== "" && (
                            <TextInput
                                style={styles.input}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                placeholder="Confirmer le mot de passe"
                                secureTextEntry={true}
                                passwordRules=""
                            />
                        )}
                        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                            <Text style={styles.submitText}>{isSubmitting ? "En cours..." : "Valider"}</Text>
                        </TouchableOpacity>
                    </View>
                    <ModalAddPicture
                        visible={bottomAddClotheSheetVisible}
                        setVisible={setBottomAddClotheSheetVisible}
                        isProfilePicture={true}
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

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
    paddingBottom: 50,
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
  photoPseudo: {
    alignItems: "center",
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
  formContainer: {
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
  },
  submitButton: {
    backgroundColor: "black",
    padding: 15,
    alignSelf: "center",
    alignItems: "center",
    width: "80%",
    marginTop: 20,
  },
  submitText: {
    color: "#FFFFFF",
    fontSize: 20,
    textAlign: "center",
  },
});

export default InfosProfileSettings;
