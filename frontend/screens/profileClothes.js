import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { url } from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const windowWidth = Dimensions.get('window').width;

const ProfileClothes = ({navigation}) => {

    const [clothes, setClothes] = useState([]);

    const fetchClothes = async () => {
        const token = await AsyncStorage.getItem('token');
        try {
            const response = await axios.get(`${url}/clothes`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            setClothes(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchClothes();
        }, [fetchClothes])
    );

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate('ClotheDetails', { item: item })}>
            <View>
                <Image source={{ uri: item.image }} style={styles.image} />
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={clothes}
                renderItem={renderItem}
                keyExtractor={item => item._id}
                numColumns={3}
                style={styles.list}
                showsVerticalScrollIndicator={false}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
    },
    list: {
        backgroundColor: '#FFFFFF',
        height: '100%',
    },
    image: {
        width: windowWidth / 3 - 1.5,
        height: windowWidth / 3 - 1.5,
        margin: 0.75,
    }
})

export default ProfileClothes;