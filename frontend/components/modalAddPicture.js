import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import Modal from "react-native-modal";

const modalAddPicture = (props) => {
  const navigation = useNavigation();
  const [imageUri, setImageUri] = useState(null);

  const toggleBottomNavigationView = () => {
    props.setVisible(!props.visible);
  };

  const toggleModal = () => {
    props.setVisible(!props.visible);
  };

  const openCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status === "granted") {
        const image = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: false,
          aspect: [4, 3],
          quality: 1,
          exif: true,
        });

        if (!image.canceled && image.assets && image.assets.length > 0) {
          if (props.isProfilePicture === true) {
            navigation.navigate("InfosProfileSettings", { imageUri: image.assets[0].uri });
          } else {
            const data = new FormData();
            data.append('image', {
              name: 'image.jpg',
              type: 'image/jpeg',
              uri: Platform.OS === 'android' ? image.assets[0].uri : image.assets[0].uri.replace('file://', ''),
            });

            await fetch('https://api-removebg.onrender.com/remove-background', {
              method: 'POST',
              body: data,
            })
              .then((response) => response.blob())
              .then((blob) => {
                var reader = new FileReader();
                reader.onload = () => {
                  const imageURI = reader.result;

                  if (props.isOutfitImage === true) {
                    props.setImage(imageURI);
                  }

                  if (props.isOutfitImage === false) {
                    navigation.navigate("AddClothe", { imageUri: imageURI });
                  }
                };
                reader.readAsDataURL(blob);
              })
              .catch((error) => {
                console.error(error);
              });
          }
        }
        toggleBottomNavigationView();
      } else {
        console.log("La permission d'accès à la caméra a été refusée");
      }
    } catch (error) {
      console.log("Erreur lors de l'ouverture de la caméra :", error);
    }
  };


  const pickImage = async (multiple) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Désolé, nous avons besoin de la permission d'accès à la galerie pour fonctionner!");
    } else {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 1,
        allowsMultipleSelection: multiple === true ? true : false,
      });

      if (!result.canceled) {
        if (multiple !== true && result.assets.length > 0) {
          if (props.isProfilePicture === true) {
            navigation.navigate("InfosProfileSettings", { imageUri: result.assets[0].uri });
          } else {
            const data = new FormData();
            data.append('image', {
              name: 'image.jpg',
              type: 'image/jpeg',
              uri: Platform.OS === 'android' ? result.assets[0].uri : result.assets[0].uri.replace('file://', ''),
            });

            await fetch('https://api-removebg.onrender.com/remove-background', {
              method: 'POST',
              body: data,
            })
              .then((response) => response.blob())
              .then((blob) => {
                var reader = new FileReader();
                reader.onload = () => {
                  const imageURI = reader.result;

                  if (props.isOutfitImage === true) {
                    props.setImage(imageURI);
                  }

                  if (props.isOutfitImage === false) {
                    navigation.navigate("AddClothe", { imageUri: imageURI });
                  }
                };
                reader.readAsDataURL(blob);
              })
              .catch((error) => {
                console.error(error);
              });
          }
        } else if (multiple === true) {
          const images = [];
          result.assets.map((image) => {
            images.push(image.uri);
          });
          navigation.navigate("AddMultipleClothe", { images: images });
        }
      }
      toggleBottomNavigationView();
    }
  };

  return (
    <Modal
      onBackdropPress={toggleModal}
      onBackButtonPress={toggleModal}
      isVisible={props.visible}
      swipeDirection="down"
      onSwipeComplete={toggleModal}
      animationInTiming={200}
      animationOutTiming={500}
      backdropTransitionInTiming={300}
      backdropTransitionOutTiming={500}
      style={styles.modal}
    >
      <View style={styles.bottomNavigationView}>
        <View style={styles.center}>
          <View style={styles.barIcon} />
        </View>
        <TouchableOpacity style={styles.textContainer} onPress={openCamera}>
          <Text style={styles.text}>Prendre une photo</Text>
        </TouchableOpacity>
        <View style={styles.line} />
        <TouchableOpacity style={styles.textContainer} onPress={pickImage}>
          <Text style={styles.text}>Importer une photo</Text>
        </TouchableOpacity>
        {props.isMultiple === true && (
          <>
            <View style={styles.line} />
            <TouchableOpacity style={styles.textContainer} onPress={() => pickImage(true)}>
              <Text style={styles.text}>Ajout multiple</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  bottomNavigationView: {
    backgroundColor: "#FFFFFF",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  center: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  barIcon: {
    width: 60,
    height: 5,
    backgroundColor: "#bbb",
    borderRadius: 3,
    marginTop: 12,
    marginBottom: 12,
  },
  text: {
    color: "black",
    textAlign: "center",
    fontSize: 17,
  },
  line: {
    height: 1,
    width: "90%",
    backgroundColor: "#bbb",
  },
  textContainer: {
    width: "100%",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 20,
  },
});

export default modalAddPicture;