import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, ImageBackground } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ModalAddClothe from "../components/modalAddClothe";

const WorkSpace = () => {
  const navigation = useNavigation();
  const [bottomAddClotheSheetVisible, setBottomAddClotheSheetVisible] = useState(false);

  const openBottomAddClotheSheet = () => {
    setBottomAddClotheSheetVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Atelier de création</Text>
      </View>
      <ImageBackground source={require("../assets/23.webp")} resizeMode="cover" style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.submitButton} onPress={() => navigation.navigate("CreateOutfit")}>
          <Text style={styles.submitText}>Créer un outfit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitButton} onPress={openBottomAddClotheSheet}>
          <Text style={styles.submitText}>Ajouter un vêtement</Text>
        </TouchableOpacity>
      </ImageBackground>
      <ModalAddClothe visible={bottomAddClotheSheetVisible} setVisible={setBottomAddClotheSheetVisible} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    flex: 1,
  },
  header: {
    display: "flex",
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
  },
  buttonsContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "130%",
    position: "relative",
    right: "15%",
  },
  submitButton: {
    backgroundColor: "black",
    padding: 15,
    alignSelf: "center",
    alignItems: "center",
    width: "60%",
    marginTop: 20,
    marginBottom: 50,
  },
  submitText: {
    color: "#FFFFFF",
    fontSize: 20,
    textAlign: "center",
  },
});

export default WorkSpace;
