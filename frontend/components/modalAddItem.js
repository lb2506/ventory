import React, { useState, useEffect } from "react";
import { View, Animated, TouchableOpacity, Text, StyleSheet, Dimensions, TouchableWithoutFeedback, Platform, Image } from "react-native";
import { FontAwesome5 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';

const windowHeight = Dimensions.get('window').height;

const ModalAddItem = ({ navigationState }) => {
    const navigation = useNavigation();
    const [isVisible, setIsVisible] = useState(false);
    const [imageUri, setImageUri] = useState(null);
    const slideAnim = useState(new Animated.Value(windowHeight))[0];
    const rotateAnim = useState(new Animated.Value(0))[0];

    function closeModal() {
        if (isVisible) {
            Animated.timing(slideAnim, {
                toValue: windowHeight,
                duration: 200,
                useNativeDriver: false,
            }).start();

            Animated.timing(rotateAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start();

            setIsVisible(false);
        }
    };

    useEffect(() => {
        closeModal();
    }, [navigationState]);

    const toggleModal = () => {
        if (!isVisible) {

            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: false,
            }).start();

            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }).start();
        } else {
            closeModal();
        }
        setIsVisible(!isVisible);
    }

    const rotateInterpolate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '45deg'],
    });

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
                if (!image.canceled) {
                    if (image.assets && image.assets.length > 0) {
                        setImageUri(image.assets[0].uri);
                    }
                    navigation.navigate('AddItem', { imageUri: image.assets[0].uri });
                }
            } else {
                console.log('La permission d\'accès à la caméra a été refusée');
            }
        } catch (error) {
            console.log('Erreur lors de l\'ouverture de la caméra :', error);
        }
    };

    return (
        <View>
            <TouchableOpacity style={styles.addButton} onPress={toggleModal}>
                <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
                    <FontAwesome5 name="plus-circle" size={50} color="#000000" />
                </Animated.View>
            </TouchableOpacity>

            <Animated.View
                style={[
                    styles.modal,
                    { transform: [{ translateY: slideAnim }] },
                    { zIndex: 2 }
                ]}
            >
                <>
                    <TouchableOpacity onPress={openCamera}>
                        <Text style={styles.option}>Ajouter un vêtement</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Text style={styles.option}>Créer un ensemble</Text>
                    </TouchableOpacity>
                </>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    option: {
        padding: 20,
        fontSize: 20,
    },
    addButton: {
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
        zIndex: 10,
    },
    modal: {
        position: 'absolute',
        width: '100%',
        bottom: 0,
        backgroundColor: '#f8f8f8',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 80,
        display: 'flex',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'gray',
        borderBottomWidth: 0
    },
    previewImage: {
        width: '100%',
        height: 300,
    },
});

export default ModalAddItem;
