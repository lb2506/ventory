import React from "react";
import { useNavigation } from "@react-navigation/native";

import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Terms = () => {
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
          <Text style={styles.titleText}>Conditions Générales d'Utilisation de l'application Ventory</Text>
          <Text style={styles.titleText}>Date d'entrée en vigueur : 28/07/2023</Text>

          <Text style={styles.explain}>
            Bienvenue sur Ventory ! Nous sommes ravis de vous accueillir sur notre réseau social dédié à l'inventaire de vêtements. Avant d'utiliser
            notre application, veuillez prendre le temps de lire attentivement les présentes Conditions Générales d'Utilisation (CGU) qui régissent
            votre utilisation de Ventory.
          </Text>
          <Text style={styles.titleText}>Acceptation des CGU</Text>
          <Text style={styles.explain}>
            En utilisant l'application Ventory, vous acceptez sans réserve d'être lié(e) par ces CGU. Si vous n'acceptez pas ces CGU, veuillez ne pas
            utiliser l'application.
          </Text>
          <Text style={styles.titleText}>Description du Service</Text>
          <Text style={styles.explain}>
            Ventory est une application de réseau social qui permet aux utilisateurs de cataloguer et d'inventorier leurs vêtements, de partager des
            informations liées à la mode et aux styles, ainsi que d'interagir avec d'autres utilisateurs au sein de la communauté.
          </Text>
          <Text style={styles.titleText}>Compte Utilisateur</Text>
          <Text style={styles.explain}>
            a. Pour utiliser pleinement les fonctionnalités de Ventory, vous devez créer un compte utilisateur. Vous êtes responsable de maintenir la
            confidentialité de vos informations de connexion, et vous acceptez de ne pas partager votre compte avec des tiers.
          </Text>
          <Text style={styles.explain}>
            b. Vous êtes entièrement responsable de toutes les activités effectuées sous votre compte. En cas de soupçon d'utilisation non autorisée
            de votre compte, veuillez nous en informer immédiatement.
          </Text>
          <Text style={styles.titleText}>Règles de Conduite de l'Utilisateur</Text>
          <Text style={styles.explain}>
            a. En utilisant Ventory, vous vous engagez à respecter les lois en vigueur et à ne pas violer les droits d'autrui.
          </Text>
          <Text style={styles.explain}>
            b. Vous acceptez de ne pas publier, partager, ou transmettre du contenu qui est illégal, diffamatoire, abusif, obscène, discriminatoire,
            menaçant, ou portant atteinte à la vie privée d'autrui.
          </Text>
          <Text style={styles.explain}>
            c. Vous ne devez pas utiliser Ventory à des fins commerciales non autorisées, telles que la publicité ou la promotion sans notre
            consentement préalable.
          </Text>
          <Text style={styles.explain}>
            d. Vous ne devez pas utiliser des bots, des scripts automatisés ou toute autre méthode non autorisée pour accéder à Ventory ou interagir
            avec son contenu.
          </Text>
          <Text style={styles.titleText}>Propriété Intellectuelle</Text>
          <Text style={styles.explain}>
            a. Tout le contenu présenté sur Ventory, y compris les logos, les graphismes, les textes, les images, les vidéos, et autres éléments, sont
            protégés par des droits de propriété intellectuelle. Ces contenus sont la propriété exclusive de Ventory ou de ses concédants de licence.
          </Text>
          <Text style={styles.explain}>
            b. Vous n'êtes pas autorisé(e) à reproduire, distribuer, modifier, ou utiliser d'une quelconque manière le contenu de Ventory sans notre
            autorisation écrite préalable.
          </Text>
          <Text style={styles.titleText}>Contenu Généré par l'Utilisateur</Text>
          <Text style={styles.explain}>
            a. Vous conservez la propriété de tout contenu que vous publiez sur Ventory. Cependant, en publiant du contenu sur l'application, vous
            accordez à Ventory une licence mondiale, non exclusive, gratuite, transférable, sous-licenciable et irrévocable pour utiliser, reproduire,
            distribuer, afficher et exploiter ce contenu dans le cadre du fonctionnement de l'application.
          </Text>
          <Text style={styles.explain}>
            b. Vous êtes responsable du contenu que vous publiez sur Ventory. Vous garantissez que vous avez tous les droits nécessaires pour publier
            ce contenu et que celui-ci est conforme aux règles de conduite énoncées dans ces CGU.
          </Text>
          <Text style={styles.titleText}>Suspension ou Résiliation</Text>
          <Text style={styles.explain}>
            Nous nous réservons le droit de suspendre ou de résilier votre accès à Ventory à tout moment et pour toute raison, y compris en cas de
            violation de ces CGU.
          </Text>
          <Text style={styles.titleText}>Modifications des CGU</Text>
          <Text style={styles.explain}>
            Nous pouvons mettre à jour ces CGU de temps à autre. Les modifications seront publiées sur l'application et prendront effet immédiatement.
            En continuant à utiliser Ventory après toute modification, vous acceptez les nouvelles CGU.
          </Text>
          <Text style={styles.titleText}>Limitation de Responsabilité</Text>
          <Text style={styles.explain}>
            a. Ventory s'efforce de fournir un service fiable et sécurisé, mais nous ne pouvons pas garantir que l'application sera toujours exempte
            de bugs, de pannes, ou d'autres problèmes techniques.
          </Text>
          <Text style={styles.explain}>
            b. Nous ne sommes pas responsables des dommages directs, indirects, accessoires, spéciaux ou consécutifs découlant de l'utilisation de
            Ventory ou de l'impossibilité de l'utiliser.
          </Text>
          <Text style={styles.titleText}>Loi Applicable et Juridiction</Text>
          <Text style={styles.explain}>
            Ces CGU seront régies et interprétées conformément aux lois en vigueur. En cas de litige, les tribunaux compétents seront ceux du lieu où
            Ventory est enregistré.
          </Text>
          <Text style={styles.explain}>
            Si vous avez des questions concernant ces CGU ou l'utilisation de Ventory, veuillez nous contacter à l'adresse contact.ventory@gmail.com
          </Text>
          <Text style={styles.explain}>
            Merci d'utiliser Ventory, et profitez pleinement de notre communauté dédiée à l'inventaire de vêtements !
          </Text>
          <Text style={styles.explain}></Text>
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
  comeBack: {
    position: "absolute",
    top: 57,
    left: 10,
  },
});

export default Terms;
