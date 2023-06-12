import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Input } from "react-native-elements";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { url } from '../api';

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const navigation = useNavigation();

    const handleSubmit = async () => {
        // Vérifier que les champs ne sont pas vides
        if (email === '' || password === '') {
            setErrorMessage('Veuillez remplir tous les champs');
            return;
        }

        try {
            const response = await axios.post(`${url}/login`, { email, password });
            await AsyncStorage.setItem('token', response.data.token);
            navigation.navigate('HomeTabs');
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                setErrorMessage(error.response.data.error);
                setPassword('');
            } else {
                setErrorMessage('Une erreur est survenue lors de la connexion, veuillez essayer à nouveau');
            }
        }
    }
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Connexion</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('OpenScreen')} style={styles.comeBack}>
                <Ionicons name="chevron-back-outline" size={35} color="#000000" />
            </TouchableOpacity>
            <Input placeholder="Adresse e-mail" value={email} onChangeText={setEmail} />
            <Input placeholder="Mot de passe" value={password} onChangeText={setPassword} secureTextEntry />
            {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
            <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                <Text style={styles.buttonText}>Continuer</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFF',
        paddingLeft: 20,
        paddingRight: 20,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 80,
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',

    },
    comeBack: {
        position: 'absolute',
        top: 80,
        left: 10
    },
    terms: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 50,
        marginTop: 50,
        width: '100%'
    },
    button: {
        backgroundColor: '#000000',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        width: '100%'
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    error: {
        color: 'red',
    },
});

export default Login;
