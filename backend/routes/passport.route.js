const express = require('express');
const router = express.Router();
const passportController = require('../controllers/passport.controller');

router.post('/add', passportController.addPassport);
router.get('/get',passportController.getPassports)

module.exports = router;
