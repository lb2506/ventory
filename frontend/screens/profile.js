import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import jwt_decode from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import LogoutBoutton from '../components/logoutButton';

import Clothes from './clothes';
import Outfits from './outfits';

import ModalAddItem from '../components/modalAddItem'
import { useNavigationState } from '@react-navigation/native';

const Tab = createMaterialTopTabNavigator();

const Profile = () => {
    const navigationState = useNavigationState((state) => state);
    const [firstName, setFirstName] = useState('');


    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (token) {
                    const decoded = jwt_decode(token);
                    setFirstName(decoded.firstName);
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
                <Text style={styles.title}>{firstName}</Text>
                <LogoutBoutton />
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
         
            <ModalAddItem navigationState={navigationState} />
         
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
})

export default Profile;
