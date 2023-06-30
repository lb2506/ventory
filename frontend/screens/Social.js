import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, Button, Keyboard, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';
import { url } from '../api';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';



const SEARCHING_DELAY = 0; // en millisecondes
const SEARCH_STATUS = {
  DEFAULT: 'default',
  COMPLETED: 'completed'
}

const Social = () => {
  const navigation = useNavigation();

  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchStatus, setSearchStatus] = useState(SEARCH_STATUS.DEFAULT);
  const [isSearchBarFocused, setSearchBarFocused] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  const [newsFeed, setNewsFeed] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchCurrentUserId = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const decoded = jwt_decode(token);
          setCurrentUserId(decoded._id);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchCurrentUserId();
  }, []);

  const fetchNewsFeed = async () => {
    try {
      const response = await axios.get(`${url}/user/feed/${currentUserId}?limit=5&page=${page}`);
      const sortedNewsFeed = [...newsFeed, ...response.data];
      setNewsFeed(sortedNewsFeed);
      setPage(page + 1);
    } catch (error) {
      console.log(error);
    }
  };



  const handleSearch = useCallback(async () => {

    if (!isSearchBarFocused) {
      setSearchResults([]);
      setSearchText('');
      setSearchStatus(SEARCH_STATUS.DEFAULT);
      return;
    }

    if (searchText.trim() === '') {
      setSearchResults([]);
      setSearchStatus(SEARCH_STATUS.DEFAULT);
      return;
    }

    try {
      const response = await axios.get(`${url}/search?q=${searchText}`);
      setSearchResults(response.data.filter(user => user._id !== currentUserId));
      setSearchStatus(SEARCH_STATUS.COMPLETED);
    } catch (error) {
      console.log(error);
    }
  }, [searchText, isSearchBarFocused]);

  useEffect(() => {
    const debounceId = setTimeout(handleSearch, SEARCHING_DELAY);
    return () => clearTimeout(debounceId);
  }, [searchText, handleSearch]);

  const listContent = () => {

    if (searchStatus === SEARCH_STATUS.COMPLETED && searchResults.length === 0) {
      return <Text style={styles.noResults}>Aucun résultat</Text>;
    }

    return (
      <FlatList
        data={searchResults}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleUserClick(item._id)}>
            <View style={styles.listItem}>
              <Text style={styles.listText}>{item.firstName} {item.lastName} {item.pseudo}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    );
  }

  const renderNewsFeedItem = ({ item }) => (

    <View style={styles.newsFeedItem}>
      <Text style={styles.newsFeedText} onPress={() => handleUserClick(item.userId)}>{item.pseudo}</Text>
      <Image style={styles.newsFeedImage} source={{ uri: item.image }} />
    </View>
  );

  const handleUserClick = (userId) => {
    navigation.navigate('SearchedProfile', { userId: userId });
  };

  useFocusEffect(
    useCallback(() => {
      setSearchBarFocused(false);
      if (currentUserId) {
        setPage(1);
        setNewsFeed([]);
        fetchNewsFeed();
      }
    }, [currentUserId])
  );


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Social</Text>
      </View>

      <View style={[styles.searchContainer, isSearchBarFocused && styles.searchContainerExpanded]}>
        <View style={styles.searchBarContainer}>
          <TextInput
            style={styles.searchBar}
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Rechercher..."
            onFocus={() => setSearchBarFocused(true)}

          />
          {isSearchBarFocused && (
            <Button
              title="Annuler"
              onPress={() => {
                setSearchText('');
                setSearchBarFocused(false);
                Keyboard.dismiss();
              }}
            />
          )}
        </View>

        {listContent()}

      </View>
      {!isSearchBarFocused && (
        <FlatList
          data={newsFeed}
          keyExtractor={(item) => item.image}
          onEndReached={fetchNewsFeed}
          onEndReachedThreshold={0.5} // adjust as necessary
          renderItem={renderNewsFeedItem}
          removeClippedSubviews={true}
          initialNumToRender={2}
          maxToRenderPerBatch={2}
          updateCellsBatchingPeriod={100}
          windowSize={7}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: 60,
    
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold'
  },
  searchBar: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 10,
    margin: 10,
    borderRadius: 10
  },
  searchContainer: {
    backgroundColor: '#FFFFFF',
  },
  searchContainerExpanded: {
    flex: 1,
  },
  searchBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 10,
  },
  searchBar: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  listText: {
    fontSize: 18
  },
  newsFeedItem: {
    margin: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
  },
  newsFeedText: {
    fontSize: 18,
    alignSelf:'flex-start'
  },
  newsFeedImage: {
    width: '100%',
    aspectRatio: 1 / 1,
    marginTop: 10,
  },
})

export default Social;