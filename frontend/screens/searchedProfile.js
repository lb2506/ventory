import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { url } from '../api';
import axios from 'axios';

import LogoutBoutton from '../components/logoutButton';
import SearchedProfileClothes from './SearchedProfileClothes';
import SearchedProfileOutfits from './SearchedProfileOutfits';

const Tab = createMaterialTopTabNavigator();

const SearchedProfile = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`${url}/user/${route.params.userId}`);
                setUserData(response.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchUserData();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{userData && userData.pseudo}</Text>
                <LogoutBoutton />
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Social')} style={styles.comeBack}>
                    <Ionicons name="chevron-back-outline" size={35} color="#000000" />
                </TouchableOpacity>
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
                <Tab.Screen name="Vêtements" component={SearchedProfileClothes} initialParams={{userId : route.params.userId}}/>
                <Tab.Screen name="Ensembles" component={SearchedProfileOutfits} initialParams={{userId : route.params.userId}}/>
            </Tab.Navigator>
        </View> 
    )
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 80,
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    comeBack: {
        position: 'absolute',
        top: 80,
        left: 10
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

export default SearchedProfile;
