import { Overlay } from "@rneui/base";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, Text, View, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Tags = (props) => {
  const [visible, setVisible] = useState(false);
  const toggleOverlay = () => {
    setVisible(!visible);
  };
  return (
    <>
      <TouchableOpacity onPress={toggleOverlay}>
        <View style={{ justifyContent: "center", borderWidth: 1, height: 50 }}>
          <Text style={{ paddingLeft: 15 }}>{props.tagsArray.join(" ")}</Text>
        </View>
      </TouchableOpacity>
      <Overlay isVisible={visible} overlayStyle={[{ backgroundColor: "white", height: "20%", width: "70%" }]} onBackdropPress={toggleOverlay}>
        <View style={{ alignItems: "center", justifyContent: "center", height: "100%" }}>
          <Text style={styles.title}>Ajouter un tag</Text>
          <View style={{ flexDirection: "row", height: "50%", alignItems: "center", justifyContent: "center" }}>
            <TextInput onChangeText={(val) => props.setTags(val)} style={{ padding: 10, width: "60%", borderWidth: 1 }}></TextInput>
            {props.tags ? (
              <TouchableOpacity
                onPress={() => {
                  props.setTagsArray((list) => [...list, props.tags]), setVisible(!visible);
                }}
              >
                <View style={{ padding: 3, border: "solid", borderWidth: 1, backgroundColor: "black", cursor: "pointer" }}>
                  <Ionicons name="save-outline" size={30} color="white"></Ionicons>
                </View>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </Overlay>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 25,
    fontWeight: "bold",
  },
});

export default Tags;
