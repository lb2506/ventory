import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, Text, View, TextInput, FlatList, Button, Keyboard, TouchableOpacity, Image, RefreshControl } from "react-native";
import axios from "axios";
import { url } from "../api";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import SkeletonSearchBar from "../components/skeletonSearchBar";
import SkeletonAvatarPseudo from "../components/skeletonAvatarPseudo";
import SkeletonSocialPost from "../components/skeletonSocialPost";
import PhotoPseudo from "../components/photoPseudo";

const SEARCHING_DELAY = 0; // en millisecondes
const SEARCH_STATUS = {
  DEFAULT: "default",
  COMPLETED: "completed",
};

const Social = () => {
  const navigation = useNavigation();

  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchStatus, setSearchStatus] = useState(SEARCH_STATUS.DEFAULT);
  const [isSearchBarFocused, setSearchBarFocused] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isFetched, setIsFetched] = useState(false);

  const [newsFeed, setNewsFeed] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchCurrentUserId = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
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
      setRefreshing(true);
      setIsFetched(false);
      const response = await axios.get(`${url}/user/feed/${currentUserId}?limit=5&page=${page}`);
      const sortedNewsFeed = [...newsFeed, ...response.data];
      setNewsFeed(sortedNewsFeed);
      setRefreshing(false);
      setPage(page + 1);
      setIsFetched(true);
    } catch (error) {
      console.log(error);
      setRefreshing(false);
    }
  };

  const handleSearch = useCallback(async () => {
    if (!isSearchBarFocused) {
      setSearchResults([]);
      setSearchText("");
      setSearchStatus(SEARCH_STATUS.DEFAULT);
      return;
    }

    if (searchText.trim() === "") {
      setSearchResults([]);
      setSearchStatus(SEARCH_STATUS.DEFAULT);
      return;
    }

    try {
      const response = await axios.get(`${url}/search?q=${searchText}`);
      setSearchResults(response.data.filter((user) => user._id !== currentUserId));
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
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleUserClick(item._id)}>
            <View style={styles.listItem}>
              <Text style={styles.listText}>
                <PhotoPseudo pictureSize={40} pseudoSize={14} pseudoName={item.pseudo} pictureUrl={item.profilePicture} pseudoVisible={true} />
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    );
  };

  const afficherDuree = (date) => {
    const dateActuelle = new Date(); // Date actuelle
    const dateDonnee = new Date(date); // Date donnée en argument

    // Calcul de la différence entre les deux dates en millisecondes
    const difference = dateActuelle - dateDonnee;

    // Conversion de la différence en secondes, minutes, heures, jours, etc.
    const secondes = Math.floor(difference / 1000);
    const minutes = Math.floor(secondes / 60);
    const heures = Math.floor(minutes / 60);
    const jours = Math.floor(heures / 24);

    // Affichage du résultat
    if (jours > 7) {
      // Formater la date exacte au format "jour mois année"
      const options = { day: "numeric", month: "long", year: "numeric" };
      const dateExacte = dateDonnee.toLocaleDateString("fr-FR", options);
      return `${dateExacte}`;
    } else if (jours > 0) {
      return `Il y a ${jours} jour${jours > 1 ? "s" : ""}`;
    } else if (heures > 0) {
      return `Il y a ${heures} heure${heures > 1 ? "s" : ""}`;
    } else if (minutes > 0) {
      return `Il y a ${minutes} minute${minutes > 1 ? "s" : ""}`;
    } else {
      return `Il y a quelques secondes`;
    }
  };

  const renderNewsFeedItem = ({ item }) => (
    <View style={styles.newsFeedItem}>
      <Text style={styles.newsFeedText} onPress={() => handleUserClick(item.userId)}>
        <PhotoPseudo pictureSize={40} pseudoSize={14} pseudoName={item.pseudo} pictureUrl={item.profilePicture} pseudoVisible={true} />
      </Text>
      <TouchableOpacity onPress={() => navigation.push("SocialClotheDetails", { item: item.idClothe })}>
        <Image style={styles.newsFeedImage} source={{ uri: item.image }} />
      </TouchableOpacity>
      <Text style={styles.newsFeedTextDate}>{afficherDuree(item.date)}</Text>
    </View>
  );

  const handleUserClick = (userId) => {
    navigation.push("SearchedProfile", { userId: userId });
  };

  useFocusEffect(
    useCallback(() => {
      setSearchBarFocused(false);
      setSearchText("");
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
        <Text style={styles.title}>VENTORY</Text>
      </View>

      <View style={[styles.searchContainer, isSearchBarFocused && styles.searchContainerExpanded]}>
        <View style={styles.searchBarContainer}>
          <TextInput
            style={styles.searchBar}
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Rechercher un compte..."
            onFocus={() => setSearchBarFocused(true)}
          />
          {isSearchBarFocused && (
            <Button
              color="black"
              title="Annuler"
              onPress={() => {
                setSearchText("");
                setSearchBarFocused(false);
                Keyboard.dismiss();
              }}
            />
          )}
        </View>

        {listContent()}
      </View>
      {!isSearchBarFocused && (
        <>
          {newsFeed.length === 0 && !isFetched ? (
            <>
              <SkeletonAvatarPseudo />
              <SkeletonSocialPost />
              <SkeletonAvatarPseudo />
              <SkeletonSocialPost />
              <SkeletonAvatarPseudo />
              <SkeletonSocialPost />
            </>
          ) : null}
          {newsFeed.length === 0 && isFetched ? (
            <Text style={styles.textNoFollowing}>
              Rien à afficher ici, suiviez des comptes ou attendez qu'ils publient !
            </Text>
          ) : null}

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
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchNewsFeed} />}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    flex: 1,
  },
  header: {
    display: "flex",
    paddingTop: 60,
    marginLeft: 10,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
  },
  searchBar: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingLeft: 10,
    margin: 10,
    borderRadius: 10,
  },
  searchContainer: {
    backgroundColor: "#FFFFFF",
  },
  searchContainerExpanded: {
    flex: 1,
  },
  searchBarContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 10,
  },
  searchBar: {
    height: 50,
    borderColor: "black",
    borderWidth: 1,
    paddingLeft: 10,
    flex: 1,
    marginRight: 10,
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  listText: {
    fontSize: 18,
  },
  noResults: {
    paddingLeft: 10,
    fontStyle: "italic",
    color: "#bbb",
  },
  newsFeedItem: {
    marginTop: 20,
    paddingBottom: 10,
    borderBottomColor:'#EFEFEF',
    borderBottomWidth:1
  },
  newsFeedText: {
    fontSize: 18,
    alignSelf: "flex-start",
    marginLeft: 10,
  },
  newsFeedTextDate: {
    fontSize: 12,
    alignSelf: "flex-start",
    marginLeft: 10,
    marginTop: 5,
    color: "#bbb",
  },
  newsFeedImage: {
    width: "100%",
    aspectRatio: 1 / 1,
    marginTop: 10,
  },
  textNoFollowing: {
    fontSize: 17,
    marginTop: 20,
    marginHorizontal: 10,
    color: "#bbb",
    fontStyle: "italic",
    lineHeight: 25,
  },
});

export default Social;
