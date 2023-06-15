import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, View, Dimensions, TouchableOpacity } from 'react-native';
import { url } from '../api';
import { useNavigation } from '@react-navigation/native';



const windowWidth = Dimensions.get('window').width;

const ProfileSearchClothes = ({ route }) => {
    const navigation = useNavigation();
    const [clothes, setClothes] = useState([]);

    const fetchClothes = async () => {

        try {
            const response = await axios.get(`${url}/user/clothes/${route.params.userId}`);
            setClothes(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchClothes();
    }, []);


    const renderItem = ({ item }) => (
        // <TouchableOpacity onPress={() => navigation.navigate('ClotheDetails', { item: item })}>
            <View>
                <Image source={{ uri: item }} style={styles.image} />
            </View>
        // </TouchableOpacity>
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

export default ProfileSearchClothes;