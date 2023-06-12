import React, { useState } from 'react';
import axios from 'axios';
import { View, Text, TouchableOpacity, Alert, StyleSheet, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Input } from "react-native-elements";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { url } from '../api';
import { Ionicons } from '@expo/vector-icons';



const Register = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const navigation = useNavigation();

    const handleSubmit = async () => {

        if (firstName.length === 0 || lastName.length === 0) {
            Alert.alert('Erreur', 'Remplir le prénom et le nom');
            return;
        }

        const emailPattern = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
        if (!emailPattern.test(email)) {
            Alert.alert('Erreur', 'Format de l\'adresse e-mail invalide.');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères.');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
            return;
        }

        if (!termsAccepted) {
            Alert.alert('Erreur', 'Vous devez accepter les conditions d\'utilisation et de confidentialité.');
            return;
        }

        try {
            const response = await axios.post(`${url}/register`, { email, password, firstName, lastName });
            await AsyncStorage.setItem('token', response.data.token);
            navigation.navigate('HomeTabs');
        } catch (error) {

            if (error.response && error.response.data && error.response.data.error) {
                setErrorMessage(error.response.data.error);
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                setFirstName('');
                setLastName('');
            } else {
                setErrorMessage('Une erreur est survenue lors de la connexion, veuillez essayer à nouveau');
            }
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Inscription</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('OpenScreen')} style={styles.comeBack}>
                <Ionicons name="chevron-back-outline" size={35} color="#000000" />
            </TouchableOpacity>
            <Input placeholder="Prénom" value={firstName} onChangeText={setFirstName} />
            <Input placeholder="Nom" value={lastName} onChangeText={setLastName} />
            <Input placeholder="Adresse e-mail" value={email} onChangeText={setEmail} />
            <Input placeholder="Mot de passe" value={password} onChangeText={setPassword} secureTextEntry />
            <Input placeholder="Confirmer le mot de passe" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
            <View style={styles.terms}>
                <Switch style={{ marginRight: 10 }} value={termsAccepted} onValueChange={setTermsAccepted} />
                <Text>J'accepte les conditions d'utilisation et de confidentialité.</Text>
            </View>
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

export default Register;
