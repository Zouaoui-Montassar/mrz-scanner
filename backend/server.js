const express = require('express');
require('dotenv').config(); 
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const passportRoutes = require('./routes/passport.route');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8200;

app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});


app.use('/passports', passportRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
