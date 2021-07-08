const Sauce = require('../models/sauce');

/**
 * Returns array of all sauces in the database.
 */
exports.gets = (req, res, next) => {
    Sauce.find()
        .then(things => res.status(200).json(things))
        .catch(error => res.status(400).json({error}));
};

/**
 * Returns the sauce with the provided _id.
 */
exports.get = (req, res, next) => {
    res.send("API is up & running");
};

/**
 * Captures and saves image, parses stringified sauce and saves it to the database, setting its imageUrl correctly. Initializes sauces likes and dislikes to 0, and usersLiked and usersDisliked to empty arrays. Note that the initial body request is empty; when multer is added it returns a string for the body request based on the data submitted with the file.
 */
exports.create = (req, res, next) => {
    delete req.body._id;
    const sauce = new Sauce({
        ...req.body
    });
    sauce.save()
        .then(() => res.status(201).json({message: 'Objet enregistré !'}))
        .catch(error => res.status(400).json({error}));
};

/**
 * Updates the sauce with the provided _id. If an image is uploaded, capture it and update the sauces imageUrl. If no file is provided, the sauce details are directly within the request body (req.body.name, req.body.heat etc). If a file is provided, the stringified sauce is in req.body.sauce. Note that initial body request is empty; when multer is added it returns a string of the body request based on the data submitted with the file.
 */
exports.update = (req, res, next) => {
    res.send("API is up & running");
};

/**
 * Deletes the sauce with the provided _id.
 */
exports.delete = (req, res, next) => {
    res.send("API is up & running");
};

/**
 * Sets “like'' status for the userId provided. If like = 1, the user likes the sauce. If like = 0, the user is cancelling their like or dislike. If like = -1, the user dislikes the sauce. The user's ID must be added to or removed from the appropriate array, keeping track of their preferences and preventing them from liking or disliking the same sauce multiple times. Total number of likes and dislikes to be updated with each like.
 */
exports.like = (req, res, next) => {
    res.send("API is up & running");
};
