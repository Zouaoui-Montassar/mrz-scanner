const Passport = require('../models/passport.model');

const addPassport = async (req, res) => {
  try {
    console.log(req.data)
    console.log('Incoming request body:', req.body);

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


const getPassports = async (req, res) => {
  try {
    const passports = await Passport.find();
    res.status(200).json({
      success: true,
      message: 'Passports retrieved successfully',
      data: passports,
    });
  } catch (err) {
    console.error('Error retrieving passports:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve passports',
      error: err.message,
    });
  }
};

module.exports = {
  addPassport,
  getPassports
};
