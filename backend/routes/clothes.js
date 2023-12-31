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
const { ObjectId } = require("mongoose").Types;

router.post("/addClothe", authenticate, upload.single("image"), async (req, res) => {
  try {
    const uploadedResponse = await cloudinary.uploader.upload(req.file.path, {
      upload_preset: "ventory",
      format: "webp",
    });

    const clothe = new Clothe({
      image: uploadedResponse.secure_url,
      public_id: uploadedResponse.public_id,
      brand: req.body.brand,
      category: req.body.category,
      season: req.body.season,
      color: req.body.color,
      size: req.body.size,
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

router.get("/clothe/:id", authenticate, async (req, res) => {
  try {
    const clothe = await Clothe.findById(req.params.id);
    res.send(clothe);
  } catch (error) {
    res.status(500).send({ error: "Une erreur est survenue en récupérant le vêtement." });
  }
});

router.get("/outfits", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
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

router.delete("/deleteClothe/:id", authenticate, async (req, res) => {
  try {
    // Récupérer le vêtement
    const clothe = await Clothe.findById(req.params.id);

    // Supprimer l'image de Cloudinary
    const destroyResponse = await cloudinary.uploader.destroy(clothe.public_id);

    if (!destroyResponse) {
      console.error("Echec de la suppression de l'image Cloudinary.");
      return res.status(500).send({ error: "Une erreur est survenue lors de la suppression de l'image Cloudinary." });
    }

    console.log("Image Cloudinary supprimée avec succès !");

    // Supprimer le vêtement de la collection 'clothes'
    await Clothe.findByIdAndDelete(req.params.id);

    // Supprimer la référence au vêtement dans l'objet utilisateur
    req.user.clothes.pull(req.params.id);
    await req.user.save();

    // Supprimer l'objectId du vêtement dans tous les outfits
    await Outfit.updateMany({ vetements: req.params.id }, { $pull: { vetements: req.params.id } });

    res.status(201).send();
    console.log("Vêtement supprimé avec succès !");
  } catch (error) {
    res.status(500).send({ error: "Une erreur est survenue lors de la suppression du vêtement." });
  }
});

router.delete("/deleteOutfit/:id", authenticate, async (req, res) => {
  try {
    // Récupérer l'outfit
    const outfit = await Outfit.findById(req.params.id);

    // Supprimer l'image de Cloudinary
    if (outfit.public_id) {
      const destroyResponse = await cloudinary.uploader.destroy(outfit.public_id);

      if (!destroyResponse) {
        console.error("Echec de la suppression de l'image Cloudinary.");
        return res.status(500).send({ error: "Une erreur est survenue lors de la suppression de l'image Cloudinary." });
      }
    }

    console.log("Image Cloudinary supprimée avec succès !");

    // Supprimer l'outfit de la collection 'outfits'
    await Outfit.findByIdAndDelete(req.params.id);

    // Supprimer la référence de l'outfit dans l'objet utilisateur
    req.user.outfits.pull(req.params.id);
    await req.user.save();

    res.status(201).send();
    console.log("Outfit supprimé avec succès !");
  } catch (error) {
    res.status(500).send({ error: "Une erreur est survenue lors de la suppression de l'Outfit." });
  }
});

router.post("/addOutfit", authenticate, upload.single("image"), async (req, res) => {
  try {
    // Check if either image or at least one vetement is present
    if (!req.file && !req.body.vetements) {
      return res.status(400).send("Either image or at least one vetement is required.");
    }

    let uploadedResponse = null;
    if (req.file) {
      uploadedResponse = await cloudinary.uploader.upload(req.file.path, {
        upload_preset: "ventory",
        format: "webp",
      });
    }

    const clotheIds = req.body.vetements ? req.body.vetements.split(",").map((id) => new ObjectId(id)) : [];

    const outfit = new Outfit({
      image: uploadedResponse ? uploadedResponse.secure_url || "" : "",
      public_id: uploadedResponse ? uploadedResponse.public_id || "" : "",
      name: req.body.name,
      category: req.body.category,
      season: req.body.season,
      color: req.body.color,
      size: req.body.size,
      tags: req.body.tags,
      vetements: clotheIds,
    });

    await outfit.save();

    req.user.outfits.push(outfit._id);
    await req.user.save();

    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        // remove the file
        if (err) {
          console.error("Failed to delete local image:" + err);
        } else {
          console.log("Fichier local supprimé avec succès !");
        }
      });
    }

    res.status(201).send(outfit);
    console.log("Outfit ajouté avec succès !");
  } catch (error) {
    console.error("Error: ", error);
    res.status(400).send(error);
  }
});

router.post("/updateOutfit/:id", authenticate, upload.single("image"), async (req, res) => {
  try {
    const outfitId = req.params.id;
    let outfit = await Outfit.findById(outfitId);

    if (!outfit) {
      return res.status(404).json({ message: "Outfit not found" });
    }

    if (req.file) {
      const uploadedResponse = await cloudinary.uploader.upload(req.file.path, {
        upload_preset: "ventory",
        format: "webp",
      });
      outfit.image = uploadedResponse.secure_url;
      outfit.public_id = uploadedResponse.public_id;
    }

    outfit.name = req.body.name || outfit.name;
    outfit.category = req.body.category || outfit.category;
    outfit.season = req.body.season || outfit.season;
    outfit.tags = req.body.tags || outfit.tags;

    if (req.body.vetements) {
      const clotheIds = req.body.vetements.split(",").map((id) => new ObjectId(id));
      outfit.vetements = clotheIds;
    }

    outfit = await outfit.save();

    req.user.outfits.push(outfit._id);
    await req.user.save();

    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        // remove the file
        if (err) {
          console.error("Failed to delete local image: " + err);
        } else {
          console.log("Fichier local supprimé avec succès !");
        }
      });
    }

    res.status(200).send(outfit);
    console.log("Outfit mis à jour avec succès !");
  } catch (error) {
    console.error("Error: ", error);
    res.status(400).send(error);
  }
});

router.put("/updateClothe/:id", authenticate, upload.single("image"), async (req, res) => {
  try {
    const clotheId = req.params.id;
    const clothe = await Clothe.findById(clotheId);

    if (!clothe) {
      return res.status(404).json({ message: "Clothe not found" });
    }

    if (req.file) {
      const uploadedResponse = await cloudinary.uploader.upload(req.file.path, {
        upload_preset: "ventory",
        format: "webp",
      });
      clothe.image = uploadedResponse.secure_url;
      clothe.public_id = uploadedResponse.public_id;
    } else {
      clothe.image = req.body.image || clothe.image;
      clothe.public_id = req.body.public_id || clothe.public_id;
    }
    clothe.brand = req.body.brand || clothe.brand;
    clothe.category = req.body.category || clothe.category;
    clothe.season = req.body.season || clothe.season;
    clothe.color = req.body.color || clothe.color;
    clothe.size = req.body.size || clothe.size;
    clothe.tags = req.body.tags || clothe.tags;

    await clothe.save();

    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        // remove the file
        if (err) {
          console.error("Failed to delete local image: " + err);
        } else {
          console.log("Fichier local supprimé avec succès !");
        }
      });
    }

    res.status(200).send(clothe);
    console.log("Clothe mis à jour avec succès !");
  } catch (error) {
    console.error("Error: ", error);
    res.status(400).send(error);
  }
});

module.exports = router;
