const User = require('../models/user');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
  try {

    const existingEmail = await User.findOne({ email: req.body.email });
    const existingPseudo = await User.findOne({ pseudo: req.body.pseudo });
    if (existingEmail) {
      return res.status(401).send({ error: 'Cette adresse mail est déjà utilisée.' });
    } else if (existingPseudo) {
      return res.status(401).send({ error: 'Ce pseudo est déjà utilisé.' });
    } else {
      const user = new User(req.body);

      await user.save();
      const token = jwt.sign({ _id: user._id.toString(), pseudo: user.pseudo }, process.env.JWT_SECRET_KEY);
      res.send({ user, token });
    }

  } catch (error) {
    res.status(401).send(error);
  }
});


module.exports = router;