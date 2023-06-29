import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { url } from '../api';
import axios from 'axios';
import jwt_decode from 'jwt-decode';


import SearchedProfileClothes from './SearchedProfileClothes';
import SearchedProfileOutfits from './SearchedProfileOutfits';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createMaterialTopTabNavigator();

const SearchedProfile = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const [userData, setUserData] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        fetchUserData();
        checkFollow();
    }, []);


    const fetchUserData = async () => {
        try {
            const response = await axios.get(`${url}/user/${route.params.userId}`);
            setUserData(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const checkFollow = async () => {
        const token = await AsyncStorage.getItem('token');
        const decoded = jwt_decode(token);
        const currentUserId = decoded._id;

        const response = await axios.get(`${url}/user/${route.params.userId}`);
        setIsFollowing(response.data.followers.includes(currentUserId));
    };

    const handleFollow = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const decoded = jwt_decode(token);
            const followerId = decoded._id;

            await axios.put(`${url}/user/${route.params.userId}/follow`, {
                followerId: followerId,
            });
            setIsFollowing(!isFollowing);
            await fetchUserData();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{userData && userData.pseudo}</Text>
                <View style={styles.followersFollowingContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate('FollowersList', { userId: userData._id })}>
                        <Text>{userData && userData.followers ? userData.followers.length : 0} follower(s)</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('FollowingList', { userId: userData._id })}>
                        <Text>{userData && userData.following ? userData.following.length : 0} suivie(s)</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.followButton} onPress={handleFollow}>
                    <Text style={styles.followButtonText}>{isFollowing ? 'Ne plus suivre' : 'Suivre'}</Text>
                </TouchableOpacity>
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
                <Tab.Screen name="Vêtements" component={SearchedProfileClothes} initialParams={{ userId: route.params.userId }} />
                <Tab.Screen name="Ensembles" component={SearchedProfileOutfits} initialParams={{ userId: route.params.userId }} />
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
    text: {
        fontSize: 20,
        marginBottom: 20,
        textAlign: 'center',
    },
    followButton: {
        paddingHorizontal: 25,
        paddingVertical: 5,
        borderRadius: 5,
        backgroundColor: '#4b4b4b',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20
    },
    followButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    followersFollowingContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '50%',
        margin: 10,
    },
})

export default SearchedProfile;