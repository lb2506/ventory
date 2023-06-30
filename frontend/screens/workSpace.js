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
      <ImageBackground source={require('../assets/23.webp')} resizeMode='cover' style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("CreateOutfit")}>
          <Text style={styles.buttonText}>Créer un outfit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={openBottomAddClotheSheet}>
          <Text style={styles.buttonText}>Ajouter un vêtement</Text>
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
    paddingBottom: 20
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
  },
  buttonsContainer:{
    flex:1,
    alignItems:'center',
    justifyContent:'center',
    width: '130%',
    position: 'relative',
    right: '15%',
  },
  button:{
    backgroundColor:'black',
    width:'50%',
    alignItems:'center',
    marginVertical:15,
    paddingHorizontal:20,
    paddingVertical:20,
    borderRadius:10
  },
  buttonText:{
    color:'white',
    fontSize:15,
    fontWeight:'bold'
  }
});

export default WorkSpace;
