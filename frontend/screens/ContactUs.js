import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Button, ScrollView, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { url } from "../api";
import * as ImagePicker from 'expo-image-picker';


const ContactUs = () => {
    const navigation = useNavigation();
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [attachments, setAttachments] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
            }
        })();
    }, []);

    const selectImages = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
        } else {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsMultipleSelection: false,
            });

            if (!result.canceled) {
                setAttachments(result.assets);
            }
        }
    };

    const handleSend = async () => {
        setIsSubmitting(true);
        const token = await AsyncStorage.getItem("token");

        try {

            let formData = new FormData();
            if (attachments.length > 0) {
                formData.append('file', {
                    uri: attachments[0].uri,
                    type: 'image/jpeg',
                    name: `contact.jpg`,
                });
            }
            formData.append('subject', subject);
            formData.append('message', message);
            formData.append('type', '[CONTACT]');


            const response = await axios.post(`${url}/contact`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                Alert.alert(
                    "Message envoyé !",
                    "Merci de nous avoir contacté, nous traiterons votre message dès que possible.",
                    [
                        {
                            text: "OK",
                            onPress: () => navigation.goBack()
                        }
                    ]
                );
            } else {
                throw new Error('Something went wrong');
            }
        } catch (error) {
            Alert.alert(
                "Erreur",
                "Un problème est survenu lors de l'envoi de votre message, merci de réessayer.",
                [
                    {
                        text: "OK"
                    }
                ]
            );
            console.error(error.response.data);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRemove = (index) => {
        let newAttachments = [...attachments];
        newAttachments.splice(index, 1);
        setAttachments(newAttachments);
    };


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.comeBack}>
                    <Ionicons name="chevron-back-outline" size={35} color="#000000" />
                </TouchableOpacity>
                <Text style={styles.title}>Nous contacter</Text>
            </View>

            <Text style={styles.explain}>
                Besoin d'aide ? Une question ? Nous sommes là pour vous !
                N'hésitez pas à nous contacter en utilisant le formulaire ci-dessous. Nous vous répondrons dès que possible.
                Nous sommes impatients de vous lire !
            </Text>


            <View>
                <TextInput
                    style={styles.input}
                    value={subject}
                    onChangeText={setSubject}
                    placeholder="Sujet"
                />
                <TextInput
                    style={[styles.input, styles.inputMessage]}
                    value={message}
                    onChangeText={setMessage}
                    placeholder="Message"
                    multiline
                    textAlignVertical='top'
                />


                {attachments.map((attachment, index) => (
                    <View key={index} style={styles.fileContainer}>
                        <Text>{`image${index + 1}.jpg`}</Text>
                        <TouchableOpacity onPress={() => handleRemove(index)}>
                            <Text style={styles.remove}>X</Text>
                        </TouchableOpacity>
                    </View>
                ))}

                {attachments.length < 1 &&
                    <TouchableOpacity onPress={selectImages} style={styles.fileContainer}>
                        <Text style={styles.addFile}>Ajouter une pièce jointe</Text>
                    </TouchableOpacity>
                }

                <TouchableOpacity onPress={handleSend} style={styles.sendContainer}>
                    <Text style={styles.send}>{isSubmitting ? "En cours..." : "Envoyer"}</Text>
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
        paddingBottom: 50,
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
    explain: {
        marginHorizontal: 10,
        textAlign: 'justify',
        marginBottom: 20
    },
    input: {
        borderWidth: 1,
        borderColor: "#000000",
        margin: 10,
        padding: 10,
    },
    inputMessage: {
        height: 300,

    },
    fileContainer: {
        flexDirection: 'row',
        marginHorizontal: 10,
    },
    addFile: {
        fontStyle: 'italic',
        textDecorationLine: 'underline',
        height: 20
    },
    remove: {
        marginLeft: 10,
        backgroundColor: '#bbb',
        padding: 4,
        fontSize: 10,
        width: 20,
        height: 20,
        textAlign: 'center',
    },
    sendContainer: {
        alignItems: 'center',
        marginTop: 50
    },
    send: {
        backgroundColor: 'black',
        color: '#FFFFFF',
        padding: 15,
        width: '80%',
        textAlign: 'center',
        fontSize: 20
    }
})

export default ContactUs
