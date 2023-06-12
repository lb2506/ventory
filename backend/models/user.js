const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  clothes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Clothing' }],
  outfits: [[{ type: mongoose.Schema.Types.ObjectId, ref: 'Clothing' }]],
});



// hacher le mot de passe avant de l'enregistrer

userSchema.pre('save', async function (next) {

  // seulement hacher le mot de passe s'il a été modifié (ou est nouveau)
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('User', userSchema);