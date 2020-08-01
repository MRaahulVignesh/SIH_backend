//importing necessary libraries
const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");

//importing routes
const user_route = require('./routes/users');

const app = express();
app.use(cors({ origin: true }));

app.use('/api/', user_route);



exports.app = functions.https.onRequest(app);
