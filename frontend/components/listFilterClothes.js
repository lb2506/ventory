import React, { useState, useEffect } from "react";
import { StyleSheet, View, TouchableOpacity, ScrollView, Text } from "react-native";
import Modal from "react-native-modal";
import ModalFilterPicker from "react-native-modal-filter-picker";
import { ListItem } from "@rneui/themed";
import { Ionicons } from "@expo/vector-icons";

const ListFilterClothes = (props) => {
  const [type, setType] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [visible, setVisible] = useState(false);
  const [options, setOptions] = useState([]);
  const [isCategoryFilter, setIsCategoryFilter] = useState(false);
  const [isBrandFilter, setIsBrandFilter] = useState(false);
  const [isSeasonFilter, setIsSeasonFilter] = useState(false);
  const [isTagFilter, setIsTagFilter] = useState(false);

  const filter = (type, value) => {
    switch (type) {
      case "brands":
        props.setListClothesShowed(props.listClothesShowed.filter((c) => c.brand === value));
        setIsBrandFilter(true);
        break;
      case "tags":
        props.setListClothesShowed(props.listClothesShowed.filter((c) => c.tags.includes(value)));
        setIsTagFilter(true);
        break;
      case "seasons":
        props.setListClothesShowed(props.listClothesShowed.filter((c) => c.season === value));
        setIsSeasonFilter(true);
        break;
      case "categories":
        props.setListClothesShowed(props.listClothesShowed.filter((c) => c.category === value));
        setIsCategoryFilter(true);
        break;
      default:
        break;
    }
  };

  var listUniqueBrands = [...new Set(props.listClothesShowed.map((c) => c.brand))].filter((brand) => brand.trim() !== "");
  var listBrands = listUniqueBrands.map((m) => ({ key: m.toLowerCase(), label: m }));
  var listUniqueTags = [...new Set(props.listClothesShowed.flatMap((c) => c.tags))].filter((tag) => tag.trim() !== "");
  var listTags = listUniqueTags.map((t) => ({ key: t.toLowerCase(), label: t }));
  var listUniqueSeasons = [...new Set(props.listClothesShowed.map((c) => c.season))].filter((season) => season.trim() !== "");
  var listSeasons = listUniqueSeasons.map((s) => ({ key: s.toLowerCase(), label: s }));
  var listUniqueCategories = [...new Set(props.listClothesShowed.map((c) => c.category))].filter((category) => category.trim() !== "");
  var listCategories = listUniqueCategories.map((c) => ({ key: c.toLowerCase(), label: c }));

  const openModal = () => {
    setVisible(!visible);
  };

  const toggleModal = (type) => {
    switch (type) {
      case "brands":
        setModalTitle("Marques");
        setType("brands");
        setOptions(listBrands);
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
        <View style={props.listClothesShowed.length === 0 ? styles.filtersContainerSkeleton : styles.filtersContainer}>
          <TouchableOpacity
            style={isCategoryFilter ? styles.filtersButtonSelected : styles.filtersButton}
            onPress={() => {
              toggleModal("categories"), openModal();
            }}
          >
            <Text style={isCategoryFilter ? styles.filtersTextSelected : styles.filtersText}>Catégories</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={isBrandFilter ? styles.filtersButtonSelected : styles.filtersButton}
            onPress={() => {
              toggleModal("brands");
              openModal();
            }}
          >
            <Text style={isBrandFilter ? styles.filtersTextSelected : styles.filtersText}>Marques</Text>
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
          {isCategoryFilter || isBrandFilter || isSeasonFilter || isTagFilter ? (
            <TouchableOpacity
              style={styles.filtersButton}
              onPress={() => {
                props.setListClothesShowed(props.clothes);
                setIsCategoryFilter(false);
                setIsBrandFilter(false);
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

export default ListFilterClothes;
