import React, { useState } from "react";
import { Text } from "@rneui/themed";
import { TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const InfoBulle = (props) => {
  const [isVisible, setIsVisible] = useState(true);

  if (isVisible === true) {
    return (
      <View style={{ width: "100%", alignItems: "center" }}>
        <View style={{ width: "100%", padding: 25, borderWidth: 1, marginBottom: 30, borderRadius:10 }}>
          <TouchableOpacity onPress={() => setIsVisible(false)} style={{ position: "absolute", right: 5, top: 5 }}>
            <Ionicons name="close-sharp" size={20} />
          </TouchableOpacity>
          <Text style={{textAlign:'justify'}}>{props.text}</Text>
        </View>
      </View>
    );
  } else {
    return null;
  }
};

export default InfoBulle;
