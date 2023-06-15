const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Import des routes
const registerRoutes = require('./routes/register')
const loginRoutes = require('./routes/login')
const clothesRouter = require('./routes/clothes');
const usersRouter = require('./routes/users')




require('dotenv').config();
const cors = require('cors');
const app = express();

app.use(bodyParser.json({ limit: '20mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }))

app.use(cors());
app.use(express.json());

// Ajout des différentes routes
app.use('/', registerRoutes);
app.use('/', loginRoutes);
app.use('/', clothesRouter);
app.use('/', usersRouter);



// Connexion à la base de données
mongoose
    .connect(process.env.MONGO_DB_CONNECTION, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Connexion à la base de données réussie..."))
    .catch((error) => console.error("problème lors de la connexion à la base de données ->", error.message));

app.listen(5000, () => console.log('Serveur lancé sur le port 5000...'));