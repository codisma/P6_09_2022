const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const sauceRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');

const path = require("path");
var cors = require ('cors');

const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://ismacode:Lrx22QrqxVcyPanS@cluster0.b1xh20d.mongodb.net/test?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));


const app = express();

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')))

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);



app.use (cors());


module.exports = app


