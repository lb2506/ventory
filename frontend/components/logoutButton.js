import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const LogoutBoutton = () => {
    const navigation = useNavigation();

    const logOut = async () => {
        await AsyncStorage.removeItem('token');
        navigation.reset({
            index: 0,
            routes: [{ name: 'OpenScreen' }],
        });
    }

    return (
        <TouchableOpacity onPress={logOut} style={styles.container}>
                <FontAwesome5 name="power-off" size={25} color="#000000" />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        position: 'absolute',
        right: 15,
        height:30
    }
})


export default LogoutBoutton;
