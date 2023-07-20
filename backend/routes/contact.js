const express = require('express');
const router = express.Router();
const authenticate = require("../middleware/auth");
const multer = require('multer');
const upload = multer({ dest: "uploads/" });
const nodemailer = require('nodemailer');
const fs = require("fs"); // import fs module

router.post("/contact", authenticate, upload.single('file'), async (req, res) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.CONTACT_EMAIL,
            pass: process.env.CONTACT_PWD
        }
    });

    let attachments = [];
    if (req.file) {
        attachments.push({
            filename: req.file.originalname,
            path: req.file.path
        });
    }

    let mailOptions = {
        from: process.env.CONTACT_EMAIL,
        to: process.env.CONTACT_EMAIL,
        subject: `${req.body.type} ${req.body.subject}`,
        text: req.body.message,
        replyTo: req.user.email,
        attachments: attachments
    };

    transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
            console.log('Error:', err);
            res.status(500).send({message: "Une erreur s'est produite lors de l'envoi de l'e-mail"});
        } else {
            console.log('Email envoyé avec succès !');
            res.status(200).send({message: "Email envoyé avec succès"});
            
            // if mail has been sent, delete the local file
            if (req.file) {
                fs.unlink(req.file.path, (err) => {
                    if (err) {
                        console.error("Failed to delete local image:" + err);
                    } else {
                        console.log("Fichier local supprimé avec succès !");
                    }
                });
            }
        }
    });
});

module.exports = router;