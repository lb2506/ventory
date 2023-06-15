const User = require('../models/user');
const express = require('express');
const router = express.Router();

// Recherche d'utilisateurs via la barre de recherche (Social)

router.get('/search', async (req, res) => {
  const searchQuery = req.query.q;

  if (!searchQuery) {
    return res.status(400).json({ error: 'Requête de recherche manquante' });
  }

  try {
    const users = await User.find({
      $or: [
        { pseudo: new RegExp(searchQuery, 'i') },
        { firstName: new RegExp(searchQuery, 'i') },
        { lastName: new RegExp(searchQuery, 'i') },
      ],
    });

    return res.json(users);
  } catch (error) {
    return res.status(500).json({ error: 'Erreur de serveur' });
  }
});

// Récupérer le profil d'un utilisateur

router.get('/user/:userId', async (req, res) => {
  const userId = req.params.userId;

  if (!userId) {
    return res.status(400).json({ error: 'User ID manquant' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    return res.json({ pseudo: user.pseudo });
  } catch (error) {
    return res.status(500).json({ error: 'Erreur de serveur' });
  }
});


// Récupérer les vêtements d'un utilisateur

router.get('/user/clothes/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId).populate('clothes');
    const clothesImages = user.clothes.map(clothe => clothe.image);
    res.send(clothesImages);
  } catch (error) {
    res.status(500).send({ error: 'Une erreur est survenue en récupérant les vêtements.' });
  }
});

// Récupérer les outfits d'un utilisateur

router.get('/user/outfits/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId).populate('outfits');
    res.send(user.outfits.image);
  } catch (error) {
    res.status(500).send({ error: 'Une erreur est survenue en récupérant les vêtements.' });
  }
});




module.exports = router;