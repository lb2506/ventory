import React, { useEffect } from "react";
import { View, Image, StyleSheet, Text } from "react-native";
import { Dialog } from "@rneui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { color } from "@rneui/base";

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("token");

      setTimeout(() => {
        if (token !== null) {
          navigation.replace("Home");
        } else {
          navigation.replace("OpenScreen");
        }
      }, 2000);
    };

    checkToken();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "black" }}>
      <Text style={styles.title}>VENTORY</Text>
      <Dialog.Loading visible={true} loadingProps={styles.loader} />
    </View>
  );
};
const styles = StyleSheet.create({
  title: {
    fontSize: 50,
    fontWeight: "bold",
    color: "white",
  },
  loader: {
    color: "white",
    marginTop: 50,
  },
});

export default SplashScreen;
