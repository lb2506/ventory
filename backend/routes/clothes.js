const express = require("express");
const Clothe = require("../models/clothe");
const Outfit = require("../models/outfit");
const User = require("../models/user");
const cloudinary = require("../cloudinary");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const router = express.Router();
const authenticate = require("../middleware/auth");
const fs = require("fs"); // import fs module
const mongoose = require("mongoose");
const { ObjectId } = require('mongoose').Types;



router.post("/addClothe", authenticate, upload.single("image"), async (req, res) => {
  try {
    const uploadedResponse = await cloudinary.uploader.upload(req.file.path, {
      upload_preset: "ventory",
      format: "webp",
    });

    const clothe = new Clothe({
      image: uploadedResponse.secure_url,
      brand: req.body.brand,
      category: req.body.category,
      season: req.body.season,
      tags: req.body.tags,
    });

    await clothe.save();

    req.user.clothes.push(clothe._id);
    await req.user.save();

    fs.unlink(req.file.path, (err) => {
      // remove the file
      if (err) {
        console.error("Failed to delete local image:" + err);
      } else {
        console.log("Fichier local supprimé avec succès !");
      }
    });

    res.status(201).send(clothe);
    console.log("Vêtement ajouté avec succès !");
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/clothes", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("clothes");
    res.send(user.clothes);
  } catch (error) {
    res.status(500).send({ error: "Une erreur est survenue en récupérant les vêtements." });
  }
});

router.delete("/deleteClothe/:id", authenticate, async (req, res) => {
  try {
    // Supprimer le vêtement de la collection 'clothes'
    await Clothe.findByIdAndDelete(req.params.id);

    // Supprimer la référence au vêtement dans l'objet utilisateur
    req.user.clothes.pull(req.params.id);
    await req.user.save();

    res.status(201).send();
    console.log("Vêtement supprimé avec succès !");
  } catch (error) {
    res.status(500).send({ error: "Une erreur est survenue lors de la suppression du vêtement." });
  }
});

router.post("/addOutfit", authenticate, upload.single("image"), async (req, res) => {
  try {
    const uploadedResponse = await cloudinary.uploader.upload(req.file.path, {
      upload_preset: "ventory",
      format: "webp",
    });

    const clotheIds = req.body.vetements.split(",").map(id => new ObjectId(id));
    console.log("clotheIds: ", clotheIds);

    const outfit = new Outfit({
      image: uploadedResponse.secure_url,
      name: req.body.name || "",
      category: req.body.category || "",
      season: req.body.season || "",
      tags: req.body.tags || [],
      vetements: clotheIds,
    });
    console.log("outfit before save: ", outfit);
    await outfit.save();
    console.log("outfit after save: ", outfit);

    req.user.outfits.push(outfit._id);
    await req.user.save();

    fs.unlink(req.file.path, (err) => {
      // remove the file
      if (err) {
        console.error("Failed to delete local image:" + err);
      } else {
        console.log("Fichier local supprimé avec succès !");
      }
    });

    res.status(201).send(outfit);
    console.log("Outfit ajouté avec succès !");
  } catch (error) {
    console.error("Error: ", error);
    res.status(400).send(error);
  }

});



module.exports = router;
