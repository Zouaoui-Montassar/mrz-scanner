const Passport = require('../models/passport.model');

const addPassport = async (req, res) => {
  try {
    const newPassport = new Passport(req.body);
    const savedPassport = await newPassport.save();
    res.status(201).json({
      success: true,
      message: 'Passport data saved successfully',
      data: savedPassport,
    });
  } catch (err) {
    console.error('Error saving passport data:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to save passport data',
      error: err.message, 
    });
  }
};

module.exports = {
  addPassport,
};
