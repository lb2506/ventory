const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) throw new Error();

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) throw new Error();
    const token = jwt.sign({ _id: user._id.toString(), firstName: user.firstName}, process.env.JWT_SECRET_KEY);
    res.send({ user, token });
  } catch (error) {
    res.status(401).send({ error: `Utilisateur inexistant, veuillez réessayer` });
  }
});

module.exports = router;