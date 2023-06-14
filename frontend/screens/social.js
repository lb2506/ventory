import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Social = () => {

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Social</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 80,
        backgroundColor: '#FFFFFF',
        flex: 1
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

export default Social;