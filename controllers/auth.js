const User = require('../models/user');
const jwt = require('jsonwebtoken');
const mongoMask = require('mongo-mask')
const bcrypt = require('bcrypt');
require('dotenv').config();

/**
 * Hashes user password, adds user to database.
 */
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({message: 'Utilisateur créé !'}))
                .catch(error => res.status(400).json({message: error.toString()}));
        })
        .catch(error => res.status(500).json({message: error.toString()}));
};

/**
 * Checks user credentials, returning the user's _id from the database and a signed JSON web token (also containing the user's _id).
 */
exports.login = (req, res, next) => {
    User.findOne({email: req.body.email}, mongoMask({'_id': '_id', 'password': 'password'}))
        .then(user => {
            if (!user) {
                return res.status(401).json({error: 'Utilisateur non trouvé !'});
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({error: 'Mot de passe incorrect !'});
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            {userId: user._id},
                            process.env.JWT_KEY,
                            {expiresIn: '24h'}
                        )
                    });
                })
                .catch(error => res.status(500).json({message: error.toString()}));
        })
        .catch(error => res.status(500).json({message: error.toString()}));
};
