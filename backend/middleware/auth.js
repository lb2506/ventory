const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // Vérifie et décode le token

    // Cherche l'utilisateur en utilisant l'ID contenu dans le token
    const user = await User.findById(decoded._id);
    
    if (!user) {
      throw new Error();
    }

    // Stocke l'utilisateur et le token sur la requête pour un usage ultérieur
    req.user = user;
    req.token = token;
    next();
  } catch (e) {
    res.status(401).send({ error: 'Veuillez vous authentifier.' });
  }
};

module.exports = authenticate;
