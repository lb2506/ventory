import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { BottomSheet } from 'react-native-btr';
import AsyncStorage from '@react-native-async-storage/async-storage';


const ModalAddClothe = ({ visible, setVisible }) => {


    const navigation = useNavigation();
  
    const toggleBottomNavigationView = () => {
        setVisible(!visible);
    };

    const logOut = async () => {
        await AsyncStorage.removeItem('token');
        setVisible(!visible)
        navigation.reset({
            index: 0,
            routes: [{ name: 'OpenScreen' }],
        });
    }

    return (
        <BottomSheet
            visible={visible}
            onBackButtonPress={toggleBottomNavigationView}
            onBackdropPress={toggleBottomNavigationView}
        >
            <View style={styles.bottomNavigationView}>
                <TouchableOpacity style={styles.textContainer}>
                    <Text style={styles.text}>
                        Réglages
                    </Text>
                </TouchableOpacity>
                <View style={styles.line} />
                <TouchableOpacity style={styles.textContainer} onPress={logOut}>
                    <Text style={styles.text}>
                        Déconnexion
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
        alignItems: 'center',
        justifyContent: 'center',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 15,
    },
    text: {
        color: "black",
        textAlign: "center",
        fontSize:17
    },
    line: {
        height: 1,
        width: '100%',
        backgroundColor: 'black'
    },
    textContainer: {
        width: '100%',
        height: 70,
        justifyContent: 'center',
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
});



export default ModalAddClothe;
