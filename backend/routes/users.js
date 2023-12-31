const User = require("../models/user");
const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/auth");
const cloudinary = require("../cloudinary");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fs = require("fs"); // import fs module

// Recherche d'utilisateurs via la barre de recherche (Social)

router.get("/search", async (req, res) => {
  const searchQuery = req.query.q;

  if (!searchQuery) {
    return res.status(400).json({ error: "Requête de recherche manquante" });
  }

  try {
    const users = await User.find({
      $or: [{ pseudo: new RegExp(searchQuery, "i") }],
    });

    return res.json(users);
  } catch (error) {
    return res.status(500).json({ error: "Erreur de serveur" });
  }
});

// Récupérer le profil d'un utilisateur

router.get("/user/:userId", async (req, res) => {
  const userId = req.params.userId;

  if (!userId) {
    return res.status(400).json({ error: "User ID manquant" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }
    return res.json({
      _id: user._id,
      pseudo: user.pseudo,
      following: user.following,
      followers: user.followers,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    return res.status(500).json({ error: "Erreur de serveur" });
  }
});

// Obtenir les followers d'un utilisateur
router.get("/user/:userId/followers", async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId).populate("followers");
    res.send(user.followers);
  } catch (error) {
    res.status(500).send({ error: "Une erreur est survenue en récupérant les followers." });
  }
});

// Obtenir les followers d'un utilisateur
router.get("/user/:userId/nbClothesOutfits", async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId);
    // Compter le nombre de clothes et outfits
    const numberOfClothes = user.clothes.length;
    const numberOfOutfits = user.outfits.length;
    const response = {
      nbClothes: numberOfClothes,
      nbOutfits: numberOfOutfits,
    };
    // Renvoyer la réponse avec le nombre de clothes et outfits
    res.send(response);
  } catch (error) {
    res.status(500).send({ error: "Une erreur est survenue en récupérant les nombres de vêtements et d'outfits." });
  }
});

// Obtenir les abonnement profil d'un utilisateur
router.get("/user/:userId/following", async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId).populate("following");
    res.send(user.following);
  } catch (error) {
    res.status(500).send({ error: "Une erreur est survenue en récupérant les followers." });
  }
});

// Récupérer les vêtements d'un utilisateur

router.get("/user/clothes/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId).populate({ path: "clothes", options: { sort: { date: -1 } } });
    res.send(user.clothes);
  } catch (error) {
    res.status(500).send({ error: "Une erreur est survenue en récupérant les vêtements." });
  }
});

// Récupérer les outfits d'un utilisateur

router.get("/user/outfits/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId).populate({
      path: "outfits",
      populate: {
        path: "vetements",
        model: "Clothe",
      },
      options: {
        sort: { date: -1 }, // Trie les outfits par date décroissante
      },
    });
    res.send(user.outfits);
  } catch (error) {
    res.status(500).send({ error: "Une erreur est survenue en récupérant les outfits." });
  }
});

// Follow / Unfollow un utilisateur
router.put("/user/:userId/follow", async (req, res) => {
  const userId = req.params.userId;
  const followerId = req.body.followerId;

  if (!userId || !followerId) {
    return res.status(400).json({ error: "User ID ou follower ID manquant" });
  }

  try {
    let user = await User.findById(userId);
    let follower = await User.findById(followerId);

    if (!user || !follower) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    // Check si l'utilisateur est déjà suivi ou non
    let indexUser = user.followers.indexOf(followerId);
    let indexFollower = follower.following.indexOf(userId);

    let message = "";

    if (indexUser == -1 && indexFollower == -1) {
      // Not followed yet, so follow
      user.followers.push(followerId);
      follower.following.push(userId);
      message = "Utilisateur suivi avec succès";
    } else {
      // Already followed, so unfollow
      user.followers.splice(indexUser, 1);
      follower.following.splice(indexFollower, 1);
      message = "Utilisateur non suivi avec succès";
    }

    await user.save();
    await follower.save();

    return res.json({ message });
  } catch (error) {
    return res.status(500).json({ error: "Erreur de serveur" });
  }
});

// Récupérer les posts des utilisateurs suivis

router.get("/user/feed/:userId", async (req, res) => {
  const userId = req.params.userId;
  const limit = parseInt(req.query.limit) || 5;
  const page = parseInt(req.query.page) || 1;

  try {
    const user = await User.findById(userId);
    const followingUsers = user.following;
    let feed = [];

    for (let i = 0; i < followingUsers.length; i++) {
      const followedUser = await User.findById(followingUsers[i]).populate("clothes");
      followedUser.clothes.forEach((clothe) =>
        feed.push({
          userId: followedUser._id,
          pseudo: followedUser.pseudo,
          profilePicture: followedUser.profilePicture,
          image: clothe.image,
          date: clothe.date,
          idClothe: clothe._id,
          type: "clothe",
        })
      );
    }

    // Trier les posts par date (plus récent au plus ancien)
    feed.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Pagination pour le lazy load
    const result = feed.slice((page - 1) * limit, page * limit);

    res.send(result);
  } catch (error) {
    res.status(500).send({ error: "An error occurred while fetching the feed." });
  }
});

// Modifier les informations d'un utilisateur
router.put("/user/:userId", authenticate, upload.single("profilePicture"), async (req, res) => {
  const userId = req.params.userId;
  try {
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    // Uploader l'image sur cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      upload_preset: "ventory",
      format: "webp",
    });

    // Supprimer le fichier image après l'upload
    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.error("Failed to delete local image:" + err);
      } else {
        console.log("Fichier local supprimé avec succès !");
      }
    });

    // Enregistrer l'URL de l'image dans le profil utilisateur
    if (result.secure_url) user.profilePicture = result.secure_url;
    if (req.body.pseudo) user.pseudo = req.body.pseudo;
    if (req.body.firstName) user.firstName = req.body.firstName;
    if (req.body.lastName) user.lastName = req.body.lastName;
    if (req.body.email) user.email = req.body.email;
    if (req.body.phone) user.phone = req.body.phone;
    if (req.body.password) user.password = req.body.password;

    await user.save();
    return res.json({ message: "Informations mises à jour avec succès" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erreur de serveur" });
  }
});

module.exports = router;
