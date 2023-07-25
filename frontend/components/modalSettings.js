import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { BottomSheet } from 'react-native-btr';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";
import Modal from "react-native-modal";

const modalAddPicture = ({ visible, setVisible }) => {
    const navigation = useNavigation();

    const toggleModal = () => {
        setVisible(!visible);
    };

    const logOut = async () => {
        try {
            await AsyncStorage.removeItem('token');
            setVisible(!visible)
            navigation.navigate("OpenScreen")
        } catch (error) {
            console.error(error);
        }
    }

    const handleNavigate = () => {
        toggleModal();
        navigation.navigate("Settings")
    }

    return (
        <Modal
            onBackdropPress={toggleModal}
            onBackButtonPress={toggleModal}
            isVisible={visible}
            swipeDirection="down"
            onSwipeComplete={toggleModal}
            animationInTiming={200}
            animationOutTiming={500}
            backdropTransitionInTiming={300}
            backdropTransitionOutTiming={500}
            style={styles.modal}
        >
            <View style={styles.bottomNavigationView}>
                <View style={styles.center}>
                    <View style={styles.barIcon} />
                </View>
                <TouchableOpacity style={styles.textContainer} onPress={() => handleNavigate()}>
                    <Text style={styles.text}>
                        Paramètres
                    </Text>
                </TouchableOpacity>
                <View style={styles.line} />
                <TouchableOpacity style={styles.textContainer} onPress={logOut}>
                    <Text style={[styles.text, { color: 'red' }]}>
                        Déconnexion
                    </Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    bottomNavigationView: {
        backgroundColor: '#FFFFFF',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 40
    },
    modal: {
        justifyContent: "flex-end",
        margin: 0,
    },
    center: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    barIcon: {
        width: 60,
        height: 5,
        backgroundColor: "#bbb",
        borderRadius: 3,
        marginTop: 12,
        marginBottom: 12,
    },
    text: {
        color: "black",
        textAlign: "center",
        fontSize: 17,
    },
    line: {
        height: 1,
        width: '90%',
        backgroundColor: '#bbb'
    },
    textContainer: {
        width: '100%',
        justifyContent: 'center',
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingVertical: 20,
    },
});



export default modalAddPicture;
