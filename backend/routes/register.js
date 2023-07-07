const User = require('../models/user');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const cloudinary = require("../cloudinary");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fs = require("fs"); // import fs module

router.post('/register', upload.single('profilePicture'), async (req, res) => {
  try {

    const existingEmail = await User.findOne({ email: req.body.email });
    const existingPseudo = await User.findOne({ pseudo: req.body.pseudo });
    if (existingEmail) {
      return res.status(401).send({ error: 'Cette adresse mail est déjà utilisée.' });
    } else if (existingPseudo) {
      return res.status(401).send({ error: 'Ce pseudo est déjà utilisé.' });
    } else {
      const result = await cloudinary.uploader.upload(req.file.path, {
        upload_preset: 'ventory',
        format: 'webp',
      });

      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error("Failed to delete local image:" + err);
        } else {
          console.log("Fichier local supprimé avec succès !");
        }
      });

      const user = new User({
        ...req.body,
        profilePicture: result.secure_url,
      });

      await user.save();
      const token = jwt.sign({ _id: user._id.toString(), pseudo: user.pseudo, following: user.following, followers: user.followers }, process.env.JWT_SECRET_KEY);
      res.send({ user, token });
    }

  } catch (error) {
    res.status(401).send(error);
  }
});


module.exports = router;