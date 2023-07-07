import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, ImageBackground } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ModalAddPicture from "../components/modalAddPicture";

const WorkSpace = () => {
  const navigation = useNavigation();
  const [bottomAddClotheSheetVisible, setBottomAddClotheSheetVisible] = useState(false);

  const openBottomAddClotheSheet = () => {
    setBottomAddClotheSheetVisible(true);
  };
  const handleImage = (value) => { };

  return (
    <View style={styles.container}>
    
      <ImageBackground source={require("../assets/23.webp")} resizeMode="cover" style={styles.buttonsContainer}>
        <View style={styles.header}>
        {/* <Text style={styles.title}>Atelier de création</Text> */}
      </View>
        <TouchableOpacity style={styles.submitButton} onPress={() => navigation.navigate("CreateOutfit")}>
          <Text style={styles.submitText}>Créer un outfit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitButton} onPress={openBottomAddClotheSheet}>
          <Text style={styles.submitText}>Ajouter un vêtement</Text>
        </TouchableOpacity>
      </ImageBackground>
      <ModalAddPicture
        visible={bottomAddClotheSheetVisible}
        setVisible={setBottomAddClotheSheetVisible}
        isOutfitImage={false}
        setImage={handleImage}
      />
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
    marginVertical: 30
  },
  submitText: {
    color: "#FFFFFF",
    fontSize: 20,
    textAlign: "center",
  },
});

export default WorkSpace;
