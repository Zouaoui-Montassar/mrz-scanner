const mongoose = require('mongoose');

const passportSchema = new mongoose.Schema({
  type: String,
  country: String,
  surname: String,
  givenNames: String,
  passportNumber: String,
  nationality: String,
  dateOfBirth: String,
  sex: String,
  dateOfExpiry: String,
  personalNumber: String,
});

const Passport = mongoose.model('Passport', passportSchema);

module.exports = Passport;
