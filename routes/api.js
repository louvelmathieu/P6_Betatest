const express = require('express');
const router = express.Router();

const Api = require('../controllers/api.js');
const SaucesController = require('../controllers/sauces');
const AuthController = require('../controllers/auth');

const multer = require('../middleware/multer-config');
const auth = require('../middleware/auth');

router.get('/', Api.ping);
router.post('/auth/signup', AuthController.signup);
router.post('/auth/login', AuthController.login);
router.get('/sauces', auth, SaucesController.gets);
router.get('/sauces/:id', auth, SaucesController.get);
router.post('/sauces', auth, multer, SaucesController.create);
router.put('/sauces/:id', auth, multer, SaucesController.update);
router.delete('/sauces/:id', auth, SaucesController.delete);
router.post('/sauces/:id/like', auth, SaucesController.like);

module.exports = router;
