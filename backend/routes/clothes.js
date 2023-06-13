const express = require('express');
const Clothing = require('../models/clothing');
const User = require('../models/user')
const cloudinary = require("../cloudinary")
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const router = express.Router();
const authenticate = require('../middleware/auth')
const fs = require('fs'); // import fs module

router.post('/addClothing', authenticate, upload.single('image'), async (req, res) => {
    try {
        const uploadedResponse = await cloudinary.uploader.upload(req.file.path, {
            upload_preset: 'ventory',
            format: 'webp',
        });

        const clothing = new Clothing({
            image: uploadedResponse.secure_url,
            brand: req.body.brand,
            category: req.body.category,
            season: req.body.season,
            tags: req.body.tags,
        });

        await clothing.save();

        req.user.clothes.push(clothing._id);
        await req.user.save();

        fs.unlink(req.file.path, (err) => { // remove the file
            if (err) {
                console.error("Failed to delete local image:" + err);
            } else {
                console.log('Fichier local supprimé avec succès !');
            }
        });


        res.status(201).send(clothing);
        console.log('Vêtement ajouté avec succès !');
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/clothes', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('clothes');
        res.send(user.clothes);
    } catch (error) {
        res.status(500).send({ error: 'Une erreur est survenue en récupérant les vêtements.' });
    }
});

router.delete('/deleteClothing/:id', authenticate, async (req, res) => {
    try {
        // Supprimer le vêtement de la collection 'clothes'
        await Clothing.findByIdAndDelete(req.params.id);

        // Supprimer la référence au vêtement dans l'objet utilisateur
        req.user.clothes.pull(req.params.id);
        await req.user.save();

        res.status(201).send();
        console.log('Vêtement supprimé avec succès !')
    } catch (error) {
        res.status(500).send({ error: 'Une erreur est survenue lors de la suppression du vêtement.' });
    }
});



module.exports = router;