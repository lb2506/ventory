import React from 'react'
import { StyleSheet, TouchableOpacity, View, Modal, Text } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons';

const SettingsBoutton = ({ onPress }) => {

    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <FontAwesome5 name="ellipsis-v" size={25} color="#000000" />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        right: 25,
        height: 30,
        width: 40
    },

})

export default SettingsBoutton;
