import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import LogoutBoutton from '../components/logoutButton';

const Home = () => {

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Accueil</Text>
                <LogoutBoutton />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 80,
        backgroundColor: '#FFFFFF',
        flex: 1,
    },
    header: {
        display: 'flex',
        alignItems: 'center',
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold'
    }
})

export default Home;