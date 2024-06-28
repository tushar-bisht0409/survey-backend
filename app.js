const express = require('express');
require('dotenv').config()
const cors = require('cors');
const adminRoutes = require('./src/routes/adminRoutes');
const userRoutes = require('./src/routes/userRoutes');
const surveyRoutes = require('./src/routes/surveyRoutes');
const uploadRoutes = require('./src/routes/uploadRoutes');
const geojsonRoutes = require('./src/routes/geojsonRoutes');
const passport = require("passport");

const app = express();

app.use(cors());

app.use(passport.initialize());
require("./src/config/passport")(passport);

app.use(express.json()); 
app.use(express.urlencoded()); 

app.use('/api/admin/', adminRoutes);
app.use('/api/user/', userRoutes);
app.use('/api/survey/', surveyRoutes);
app.use('/api/upload/', uploadRoutes);
app.use('/api/geojson/', geojsonRoutes);

module.exports = app;