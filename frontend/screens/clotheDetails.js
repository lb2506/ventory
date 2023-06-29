import axios from 'axios';
import { url } from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';

function ClotheDetails({ route, navigation }) {
  const { item } = route.params;

  const deleteClothe = async () => {
    const token = await AsyncStorage.getItem('token');

    try {
      await axios.delete(`${url}/deleteClothe/${item._id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      navigation.goBack();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.comeBack}>
        <Ionicons name="chevron-back-outline" size={35} color="#000000" />
      </TouchableOpacity>
      <Image source={{ uri: item.image }} style={{ width: 200, height: 200 }} />
      <Text>Category: {item.category}</Text>
      <Text>Brand: {item.brand}</Text>
      <Text>Season: {item.season}</Text>
      <Text>Tags: {item.tags}</Text>
      <Text>Date: {format(new Date(item.date), 'dd/MM/yyyy')}</Text>
      <TouchableOpacity onPress={deleteClothe} style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>Supprimer</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF'
  },
  comeBack: {
    position: 'absolute',
    top: 80,
    left: 10
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    marginTop: 20,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});


export default ClotheDetails;