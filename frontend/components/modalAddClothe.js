import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { BottomSheet } from 'react-native-btr';
import * as ImagePicker from 'expo-image-picker';

const ModalAddClothe = ({ visible, setVisible }) => {


    const navigation = useNavigation();
    const [imageUri, setImageUri] = useState(null);

    const toggleBottomNavigationView = () => {
        setVisible(!visible);
    };

    const openCamera = async () => {
        try {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status === 'granted') {
                const image = await ImagePicker.launchCameraAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: false,
                    aspect: [4, 3],
                    quality: 1,
                    exif: true
                });
                toggleBottomNavigationView();
                if (!image.canceled) {
                    if (image.assets && image.assets.length > 0) {
                        setImageUri(image.assets[0].uri);
                    }
                    navigation.navigate('AddClothe', { imageUri: image.assets[0].uri });
                }
            } else {
                console.log('La permission d\'accès à la caméra a été refusée');
            }
        } catch (error) {
            console.log('Erreur lors de l\'ouverture de la caméra :', error);
        }
    };

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Désolé, nous avons besoin de la permission d\'accès à la galerie pour fonctionner!');
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
                navigation.navigate('AddClothe', { imageUri: result.assets[0].uri });
            }
            toggleBottomNavigationView();
        }
    };
    return (
        <BottomSheet
            visible={visible}
            onBackButtonPress={toggleBottomNavigationView}
            onBackdropPress={toggleBottomNavigationView}
        >
            <View style={styles.bottomNavigationView}>
                <TouchableOpacity style={styles.textContainer} onPress={openCamera}>
                    <Text style={styles.text}>
                        Prendre une photo
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.textContainer} onPress={pickImage}>
                    <Text style={styles.text}>
                        Importer une photo
                    </Text>
                </TouchableOpacity>
            </View>
        </BottomSheet>
    );
};

const styles = StyleSheet.create({
    bottomNavigationView: {
        backgroundColor: '#FFFFFF',
        width: '100%',
        height: 200,
        alignItems: 'center',
        justifyContent: 'center',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 50,
    },
    text: {
        fontSize: 20,
        textAlign: 'center',
        padding: 25,
    },
    textContainer: {
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        width: '100%',
    },
});



export default ModalAddClothe;
