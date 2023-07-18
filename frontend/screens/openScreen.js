import React, { useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const OpenScreen = ({ navigation }) => {
  const checkToken = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token !== null) {
        navigation.navigate("HomeTabs");
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Ventory</Text>
      </View>
      <View>
        <Ionicons name="finger-print-sharp" size={150} color="black" />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Login")}>
          <Text style={styles.buttonText}>Connexion</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Register")}>
          <Text style={styles.buttonText}>Inscription</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFF",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-evenly",
  },

  title: {
    fontSize: 50,
    textTransform: "uppercase",
    fontWeight: "bold",
  },

  buttonContainer: {
    width: "80%",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#000000",
    padding: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default OpenScreen;
