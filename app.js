const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');

module.exports = app;
app.use(express.json())
app.use('/images', express.static(path.join(__dirname, 'images')));

mongoose.connect('mongodb+srv://root:LiGUdDP6H67h43L@cluster0.lgnuk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));
