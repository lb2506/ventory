import React from "react";
import { useNavigation } from "@react-navigation/native";

import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const AboutUs = () => {

    const navigation = useNavigation()

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.comeBack}>
                    <Ionicons name="chevron-back-outline" size={35} color="#000000" />
                </TouchableOpacity>
                <Text style={styles.title}>À propos de nous</Text>
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
})

export default AboutUs