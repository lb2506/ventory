import React from "react";
import { useNavigation } from "@react-navigation/native";

import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const AboutUs = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.comeBack}>
          <Ionicons name="chevron-back-outline" size={35} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.title}>À propos de nous</Text>
      </View>
      <ScrollView>
        <View>
          <Text style={styles.titleText}>Bienvenue sur Ventory !</Text>
          <Text style={styles.explain}>
            Nous sommes deux amis et passionnés de développement web qui se sont rencontrés lors d'une aventure commune à La Capsule, un bootcamp de
            développement web intensif. Forts de notre expérience et de notre complicité, nous avons uni nos compétences pour créer Ventory, une
            application unique dédiée à l'inventaire de vêtements outfits.
          </Text>
          <Text style={styles.explain}>
            Notre histoire a débuté avec une simple idée : nous avions besoin d'un outil pour organiser notre propre garde-robe. Rapidement, nous
            avons réalisé que beaucoup d'autres personnes pourraient également bénéficier de cet outil pratique. C'est ainsi qu'est née l'idée de
            partager Ventory avec le monde.
          </Text>
          <Text style={styles.explain}>
            Notre objectif principal en créant cette application était de fournir une solution simple et intuitive pour aider les utilisateurs à gérer
            et cataloguer leurs vêtements. Que vous soyez un amateur de mode passionné, un minimaliste soucieux de son impact environnemental ou tout
            simplement quelqu'un qui aime garder une trace de ses articles préférés, Ventory est conçu pour répondre à vos besoins.
          </Text>
          <Text style={styles.explain}>
            Ce projet a été une aventure stimulante pour nous deux. Des heures de codage, de conception et d'itérations nous ont permis de façonner
            Ventory selon nos aspirations et nos valeurs. Nous croyons fermement en l'importance de la simplicité et de la convivialité, c'est
            pourquoi nous avons veillé à ce que l'application soit accessible à tous, même sans compétences techniques avancées.
          </Text>
          <Text style={styles.explain}>
            L'équipe derrière Ventory est animée par la passion de créer une communauté solide et bienveillante, où les utilisateurs peuvent partager
            leurs découvertes mode, échanger des conseils et s'inspirer mutuellement. Nous croyons en la puissance de la collaboration et de l'échange
            d'idées, et c'est pourquoi nous encourageons activement notre communauté à s'exprimer et à participer.
          </Text>
          <Text style={styles.explain}>
            Nous tenons à remercier chaleureusement tous ceux qui ont contribué à faire de Ventory une réalité, que ce soit par leur soutien, leurs
            encouragements ou leurs précieux retours. Votre engagement a été déterminant dans l'évolution de notre application.
          </Text>
          <Text style={styles.explain}>
            Enfin, nous sommes conscients que notre voyage ne fait que commencer. Nous sommes impatients de continuer à améliorer Ventory, d'ajouter
            de nouvelles fonctionnalités et d'explorer de nouvelles opportunités pour mieux répondre à vos attentes.
          </Text>
          <Text style={styles.explain}>
            Si vous avez des questions, des commentaires ou simplement l'envie de nous dire bonjour, n'hésitez pas à nous contacter. Nous serions
            ravis d'échanger avec vous !
          </Text>
          <Text style={styles.explain}>Merci de faire partie de l'aventure Ventory !</Text>
          <Text style={styles.explain}>PS: C'est ChatGPT qui a écrit ce texte</Text>
          <Text style={styles.explain}>Cordialement,</Text>
          <Text style={styles.titleText}>Santiago et Léo. L'équipe Ventory !</Text>
        </View>
      </ScrollView>
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
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 50,
    justifyContent: "center",
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
  },
  titleText: {
    fontWeight: "bold",
    marginHorizontal: 10,
    marginBottom: 10,
  },
  explain: {
    marginHorizontal: 10,
    textAlign: "justify",
    marginBottom: 20,
  },
  comeBack: {
    position: "absolute",
    top: 57,
    left: 10,
  },
});

export default AboutUs;
