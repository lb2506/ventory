import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";


const Settings = () => {
    const navigation = useNavigation()
    
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.comeBack}>
                    <Ionicons name="chevron-back-outline" size={35} color="#000000" />
                </TouchableOpacity>
                <Text style={styles.title}>Paramètres</Text>
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
        alignItems: "center",
        paddingTop: 60,
        paddingBottom: 20
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

export default Settings;