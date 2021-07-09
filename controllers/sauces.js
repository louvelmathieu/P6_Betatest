const Sauce = require('../models/sauce');
const fs = require('fs');

/**
 * Returns array of all sauces in the database.
 */
exports.gets = (req, res, next) => {
    Sauce.find()
        .then(things => res.status(200).json(things))
        .catch(error => res.status(400).json({message: error.toString()}));
};

/**
 * Returns the sauce with the provided _id.
 */
exports.get = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then(thing => res.status(200).json(thing))
        .catch(error => res.status(404).json({message: error.toString()}));
};

/**
 * Captures and saves image, parses stringified sauce and saves it to the database, setting its imageUrl correctly. Initializes sauces likes and dislikes to 0, and usersLiked and usersDisliked to empty arrays. Note that the initial body request is empty; when multer is added it returns a string for the body request based on the data submitted with the file.
 */
exports.create = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;

    // Set default value
    sauceObject.likes = 0;
    sauceObject.dislikes = 0;
    sauceObject.usersLiked = [];
    sauceObject.usersDisliked = [];

    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({message: 'Objet enregistré !'}))
        .catch(error => res.status(400).json({message: error.toString()}));
};

/**
 * Updates the sauce with the provided _id. If an image is uploaded, capture it and update the sauces imageUrl. If no file is provided, the sauce details are directly within the request body (req.body.name, req.body.heat etc). If a file is provided, the stringified sauce is in req.body.sauce. Note that initial body request is empty; when multer is added it returns a string of the body request based on the data submitted with the file.
 */
exports.update = (req, res, next) => {
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : {...req.body};

    delete sauceObject.likes;
    delete sauceObject.dislikes;
    delete sauceObject.usersLiked;
    delete sauceObject.usersDisliked;

    Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
        .then(() => res.status(200).json({message: 'Objet modifié !'}))
        .catch(error => res.status(400).json({message: error.toString()}));
};

/**
 * Deletes the sauce with the provided _id.
 */
exports.delete = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({_id: req.params.id})
                    .then(() => res.status(200).json({message: 'Objet supprimé !'}))
                    .catch(error => res.status(400).json({message: error.toString()}));
            });
        })
        .catch(error => res.status(500).json({message: error.toString()}));
};

/**
 * Sets “like'' status for the userId provided. If like = 1, the user likes the sauce. If like = 0, the user is cancelling their like or dislike. If like = -1, the user dislikes the sauce. The user's ID must be added to or removed from the appropriate array, keeping track of their preferences and preventing them from liking or disliking the same sauce multiple times. Total number of likes and dislikes to be updated with each like.
 */
exports.like = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => {

            switch (req.body.like) {
                case 1 : // Like
                    if (sauce.usersLiked.includes(req.body.userId)) {
                        // Do nothing
                        res.status(200).json({message: 'User already like'})
                        return
                    } else {
                        sauce.likes++;
                        sauce.usersLiked.push(req.body.userId)
                    }

                    if (sauce.usersDisliked.includes(req.body.userId)) {
                        sauce.usersDisliked = sauce.usersDisliked.filter(e => e !== req.params.userId);
                        sauce.dislikes--;
                    }
                    break;
                case 0 :
                    if (sauce.usersLiked.includes(req.body.userId)) {
                        sauce.likes--;
                        sauce.usersLiked = sauce.usersLiked.filter(e => e !== req.body.userId);
                    }
                    if (sauce.usersDisliked.includes(req.body.userId)) {
                        sauce.dislikes--;
                        sauce.usersDisliked = sauce.usersDisliked.filter(e => e !== req.body.userId);
                    }
                    break;
                case -1 : // Dislike
                    if (sauce.usersDisliked.includes(req.body.userId)) {
                        // Do nothing
                        res.status(200).json({message: 'User already dislike'})
                        return
                    } else {
                        sauce.dislikes++;
                        sauce.usersDisliked.push(req.body.userId)
                    }

                    if (sauce.usersLiked.includes(req.body.userId)) {
                        sauce.usersLiked = sauce.usersLiked.filter(e => e !== req.body.userId);
                        sauce.likes--;
                    }
                    break;
            }
            sauce.save()
                .then(() => res.status(200).json({message: 'Objet modifié !'}))
                .catch(error => res.status(400).json({message: error.toString()}));
        })
        .catch(error => res.status(500).json({message: error.toString()}));
};
