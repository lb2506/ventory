import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import jwt_decode from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';


import LogoutBoutton from '../components/logoutButton';
import AddItemsButton from '../components/addItemsButton';
import ModalAddClothe from '../components/modalAddClothe';

import Clothes from './clothes';
import Outfits from './outfits';

const Tab = createMaterialTopTabNavigator();

const Profile = () => {

    const [pseudo, setPseudo] = useState('');
    const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
    const openBottomSheet = () => {
        setBottomSheetVisible(true);
      };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (token) {
                    const decoded = jwt_decode(token);
                    setPseudo(decoded.pseudo);
                    console.log(decoded);
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchUser();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{pseudo}</Text>
                <LogoutBoutton />
                <AddItemsButton onPress={openBottomSheet}/>
            </View>
            <Tab.Navigator
                screenOptions={{
                    "tabBarActiveTintColor": "black",
                    "tabBarInactiveTintColor": "gray",
                    "tabBarIndicatorStyle": {
                        "backgroundColor": "black",
                    },
                    "tabBarStyle": {
                        "backgroundColor": "#fff"
                    }
                }}
            >
                <Tab.Screen name="Mes vêtements" component={Clothes} />
                <Tab.Screen name="Mes ensembles" component={Outfits} />
            </Tab.Navigator>
            <ModalAddClothe visible={bottomSheetVisible} setVisible={setBottomSheetVisible}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 80,
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    header: {
        display: 'flex',
        alignItems: 'center',
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold'
    },
    button: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomNavigationView: {
        backgroundColor: '#fff',
        width: '100%',
        height: 250,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 20,
        marginBottom: 20,
        textAlign: 'center',
    },
})

export default Profile;
