import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Button, ActivityIndicator, Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';
import axios from "axios";
import { url } from "../api";

const InfosProfileSettings = () => {
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

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = await AsyncStorage.getItem("token");
                if (token) {
                    const decoded = jwt_decode(token);
                    const response = await axios.get(`${url}/user/${decoded._id}`);
                    setUserData(response.data);
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
        fetchUserData()
    }, [])

    const handlePasswordChange = (text) => {
        setPassword(text);
        if (text === '') {
            setConfirmPassword('');
        }
    }

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
                const decoded = jwt_decode(token);
                const response = await axios.put(`${url}/user/${decoded._id}`, {
                    pseudo,
                    firstName,
                    lastName,
                    email,
                    phone,
                    password
                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                // Mettre à jour l'état avec les nouvelles informations de l'utilisateur
                setUserData(response.data);
                setIsSubmitting(false);
                navigation.goBack()
                // Redirection vers un autre écran ou affichage d'un message de succès
            }
        } catch (error) {
            console.log(error);
            setIsSubmitting(false);
        }
    };


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.comeBack}>
                    <Ionicons name="chevron-back-outline" size={35} color="#000000" />
                </TouchableOpacity>
                <Text style={styles.title}>Informations du profil</Text>
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
        </View>
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
        paddingBottom: 20,
        justifyContent: 'center'
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
        padding: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
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
})

export default InfosProfileSettings;
