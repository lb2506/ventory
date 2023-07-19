import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";

const listItems = [
    { title: "Informations du profil", screen: "InfosProfileSettings" },
    { title: "Nous contacter", screen: "ContactUs" },
    { title: "À propos", screen: "About" },
    { title: "Signaler un bug", screen: "ReportingBug" },
    { title: "Conditions générales d'utilisation", screen: "Terms" }
]

const Settings = () => {
    const navigation = useNavigation()

    const ListItem = ({ item }) => (
        <TouchableOpacity
            style={styles.listItem}
            onPress={() => navigation.navigate(item.screen)}
        >
            <Text style={styles.listItemText}>{item.title}</Text>
            <Ionicons name="chevron-forward-outline" size={25} color="#000000" />
        </TouchableOpacity>
    )

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.comeBack}>
                    <Ionicons name="chevron-back-outline" size={35} color="#000000" />
                </TouchableOpacity>
                <Text style={styles.title}>Paramètres</Text>
            </View>
            <FlatList
                data={listItems}
                renderItem={ListItem}
                keyExtractor={(item) => item.title}
            />
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
    listItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#D3D3D3",
    },
    listItemText: {
        fontSize: 18,
    },
})

export default Settings;
