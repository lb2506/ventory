import React, { useState, useEffect } from "react";
import { StyleSheet, View, TouchableOpacity, ScrollView, Text } from "react-native";
import Modal from "react-native-modal";
import ModalFilterPicker from "react-native-modal-filter-picker";
import { ListItem } from "@rneui/themed";
import { Ionicons } from "@expo/vector-icons";

const ListFilterOutfits = (props) => {
  const [type, setType] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [visible, setVisible] = useState(false);
  const [options, setOptions] = useState([]);
  const [isCategoryFilter, setIsCategoryFilter] = useState(false);
  const [isNameFilter, setIsNameFilter] = useState(false);
  const [isSeasonFilter, setIsSeasonFilter] = useState(false);
  const [isTagFilter, setIsTagFilter] = useState(false);

  const filter = (type, value) => {
    switch (type) {
      case "name":
        props.setListOutfitsShowed(props.listOutfitsShowed.filter((c) => c.name === value));
        setIsNameFilter(true);
        break;
      case "tags":
        props.setListOutfitsShowed(props.listOutfitsShowed.filter((c) => c.tags.includes(value)));
        setIsTagFilter(true);
        break;
      case "seasons":
        props.setListOutfitsShowed(props.listOutfitsShowed.filter((c) => c.season === value));
        setIsSeasonFilter(true);
        break;
      case "categories":
        props.setListOutfitsShowed(props.listOutfitsShowed.filter((c) => c.category === value));
        setIsCategoryFilter(true);
        break;
      default:
        break;
    }
  };

  var listUniqueNoms = [...new Set(props.listOutfitsShowed.map((c) => c.name))];
  var listNoms = listUniqueNoms.map((m) => ({ key: m.toLowerCase(), label: m }));
  var listUniqueTags = [...new Set(props.listOutfitsShowed.flatMap((c) => c.tags))];
  var listTags = listUniqueTags.map((t) => ({ key: t.toLowerCase(), label: t }));
  var listUniqueSeasons = [...new Set(props.listOutfitsShowed.map((c) => c.season))];
  var listSeasons = listUniqueSeasons.map((s) => ({ key: s.toLowerCase(), label: s }));
  var listUniqueCategories = [...new Set(props.listOutfitsShowed.map((c) => c.category))];
  var listCategories = listUniqueCategories.map((c) => ({ key: c.toLowerCase(), label: c }));

  const openModal = () => {
    setVisible(!visible);
  };

  const toggleModal = (type) => {
    switch (type) {
      case "name":
        setModalTitle("Nom");
        setType("name");
        setOptions(listNoms);
        break;
      case "tags":
        setModalTitle("Tags");
        setOptions(listTags);
        setType("tags");
        break;
      case "seasons":
        setModalTitle("Saisons");
        setOptions(listSeasons);
        setType("seasons");
        break;
      case "categories":
        setModalTitle("Catégories");
        setOptions(listCategories);
        setType("categories");
        break;
      default:
        break;
    }
  };

  return (
    <>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={props.listOutfitsShowed.length === 0 ? styles.filtersContainerSkeleton : styles.filtersContainer}>
          <TouchableOpacity
            style={isCategoryFilter ? styles.filtersButtonSelected : styles.filtersButton}
            onPress={() => {
              toggleModal("categories"), openModal();
            }}
          >
            <Text style={isCategoryFilter ? styles.filtersTextSelected : styles.filtersText}>Catégories</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={isNameFilter ? styles.filtersButtonSelected : styles.filtersButton}
            onPress={() => {
              toggleModal("name");
              openModal();
            }}
          >
            <Text style={isNameFilter ? styles.filtersTextSelected : styles.filtersText}>Noms</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={isSeasonFilter ? styles.filtersButtonSelected : styles.filtersButton}
            onPress={() => {
              toggleModal("seasons"), openModal();
            }}
          >
            <Text style={isSeasonFilter ? styles.filtersTextSelected : styles.filtersText}>Saisons</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={isTagFilter ? styles.filtersButtonSelected : styles.filtersButton}
            onPress={() => {
              toggleModal("tags"), openModal();
            }}
          >
            <Text style={isTagFilter ? styles.filtersTextSelected : styles.filtersText}>Tags</Text>
          </TouchableOpacity>
          {isCategoryFilter || isNameFilter || isSeasonFilter || isTagFilter ? (
            <TouchableOpacity
              style={styles.filtersButton}
              onPress={() => {
                props.setListOutfitsShowed(props.outfits);
                setIsCategoryFilter(false);
                setIsNameFilter(false);
                setIsSeasonFilter(false);
                setIsTagFilter(false);
              }}
            >
              <Ionicons name="close" size={20} color="black" />
            </TouchableOpacity>
          ) : null}
        </View>
      </ScrollView>
      <Modal
        onBackdropPress={openModal}
        onBackButtonPress={openModal}
        isVisible={visible}
        swipeDirection={null}
        onSwipeComplete={openModal}
        animationInTiming={200}
        animationOutTiming={500}
        backdropTransitionInTiming={300}
        backdropTransitionOutTiming={500}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <View style={{ alignItems: "center" }}>
            <Text style={styles.text}>Filtrer par {modalTitle.toLowerCase()}</Text>
          </View>
          <ScrollView style={{ flex: 1 }}>
            {options.map((l, i) => (
              <ListItem
                key={i}
                onPress={() => {
                  filter(type, l.label), openModal();
                }}
                bottomDivider
              >
                <ListItem.Content>
                  <ListItem.Title>{l.label}</ListItem.Title>
                </ListItem.Content>
              </ListItem>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  filtersContainer: {
    flexDirection: "row",
  },
  filtersContainerSkeleton: {
    flexDirection: "row",
    marginBottom: 40,
  },

  filtersButton: {
    borderColor: "black",
    borderWidth: 1,
    marginRight: 10,
    marginLeft: 1,
    marginVertical: 10,
    padding: 5,
    height: 30,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  filtersButtonSelected: {
    borderColor: "black",
    backgroundColor: "black",
    borderWidth: 1,
    marginRight: 10,
    marginLeft: 1,
    marginVertical: 10,
    padding: 5,
    height: 30,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  filtersText: {
    color: "black",
  },
  filtersTextSelected: {
    color: "white",
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "white",
    paddingTop: 12,
    paddingHorizontal: 12,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    minHeight: 400,
    paddingBottom: 20,
    maxHeight:'50%'
  },
  barIcon: {
    width: 60,
    height: 5,
    backgroundColor: "#bbb",
    borderRadius: 3,
  },
  text: {
    color: "black",
    fontSize: 24,
    marginTop: 20,
    fontWeight: "bold",
  },
});

export default ListFilterOutfits;
