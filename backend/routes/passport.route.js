const express = require('express');
const router = express.Router();
const passportController = require('../controllers/passport.controller');

router.post('/add', passportController.addPassport);

module.exports = router;
