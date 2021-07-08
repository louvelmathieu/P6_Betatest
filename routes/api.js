const express = require('express');
const router = express.Router();
const Api = require('../controllers/api.js');
const Sauces = require('../controllers/sauces');

router.get('/', Api.ping);
router.post('/auth/signup', Api.ping);
router.post('/auth/login', Api.ping);
router.get('/sauces', Sauces.gets);
router.get('/sauces/:id', Sauces.get);
router.post('/sauces', Sauces.create);
router.put('/sauces/:id', Sauces.update);
router.delete('/sauces/:id', Sauces.delete);
router.post('/sauces/:id/like', Sauces.like);

module.exports = router;
