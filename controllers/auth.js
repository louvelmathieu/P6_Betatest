/**
 * Hashes user password, adds user to database.
 */
exports.signup = (req, res, next) => {
    res.send("API is up & running");
};

/**
 * Checks user credentials, returning the user's _id from the database and a signed JSON web token (also containing the user's _id).
 */
exports.login = (req, res, next) => {
    res.send("API is up & running");
};
