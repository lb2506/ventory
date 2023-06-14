import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons';

const AddItemsButton = ({onPress}) => {

    return (
        <TouchableOpacity  style={styles.container} onPress={onPress}>
                <FontAwesome5 name="plus-square" size={25} color="#000000" />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        position: 'absolute',
        right: 70,
        height:30
    }
})


export default AddItemsButton;
