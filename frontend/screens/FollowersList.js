import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { url } from '../api';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";


const FollowersList = ({ route }) => {
    const navigation = useNavigation();
    const [followers, setFollowers] = useState([]);

    useEffect(() => {
        const fetchFollowers = async () => {
            try {
                const response = await axios.get(`${url}/user/${route.params.userId}/followers`);
                setFollowers(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchFollowers();
    }, [route.params.userId]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.comeBack}>
                    <Ionicons name="chevron-back-outline" size={35} color="#000000" />
                </TouchableOpacity>
                <Text style={styles.title}>Follower(s)</Text>
            </View>
            <FlatList
                data={followers}
                keyExtractor={item => item._id}
                renderItem={({ item }) => (
                    <View style={styles.listItem}>
                        <Text style={styles.listText}>{item.pseudo}</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        flex: 1
    },
    header: {
        paddingTop: 80,
        alignItems: 'center',
        paddingBottom: 20
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold'
    },
    listItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    listText: {
        fontSize: 18
    },
    comeBack: {
        position: 'absolute',
        top: 77,
        left: 10,
    },
});

export default FollowersList;