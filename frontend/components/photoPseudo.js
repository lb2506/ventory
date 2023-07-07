import React from "react";
import { Image, StyleSheet, View, Text } from "react-native";

const PhotoPseudo = ({ pictureSize, pseudoSize, pseudoName, pictureUrl, pseudoVisible }) => {

    return (
        <View style={styles.container}>
            <View style={[styles.imageContainer, { height: pictureSize, width: pictureSize, borderRadius: pictureSize / 2 }]}>
                <Image style={styles.image} source={{ uri: pictureUrl }} resizeMode="cover" />
            </View>
            {pseudoVisible &&
                <Text style={[styles.pseudo, { fontSize: pseudoSize }]}>{pseudoName}</Text>
            }
        </View>
    )
}


const styles = StyleSheet.create({

    container: {
        flexDirection: 'row',
        marginLeft: 10,
        alignItems: 'center'
    },
    imageContainer: {
        overflow: 'hidden',
        marginRight: 15,
        borderWidth: '0.5%',
        borderColor: 'black'
    },
    image: {
        flex: 1,
        width: null,
        height: null,
    },
    pseudo: {
        fontWeight: "bold",
    }
})
export default PhotoPseudo