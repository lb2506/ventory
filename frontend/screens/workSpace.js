import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';


const AddItemsScreen = () => {
   

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Atelier d'assemblage</Text>
            </View>
            <View style={styles.addPictures}>
                <TouchableOpacity style={styles.addButton}>
                    <Text style={styles.option}>Importer une photo du telephone</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.addButton}>
                    <Text style={styles.option}>Importer une photo du profil</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 80,
        backgroundColor: '#FFFFFF',
        flex: 1
    },
    header: {
        display: 'flex',
        alignItems: 'center',
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold'
    },
    addPictures:{
        width:'100%',
        position:'absolute',
        bottom:0,
        flexDirection:'row',
    },
    addButton:{
        width:'50%',
        alignItems:'center',
        padding:20,
        borderWidth: 1,
        borderColor:'black',
    }
})

export default AddItemsScreen;