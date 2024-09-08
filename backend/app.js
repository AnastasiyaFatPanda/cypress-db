// const path = require("path");
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const usersRoutes = require('./routes/users');

const mongoUrl = 'mongodb://127.0.0.1:27017/mongodb';

console.log('Try to connect to MongoDb...');
// this will create db adn collection if theew is not
mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log('Connected to MongoDB successfully');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS']);
  next();
});

// app.use("/") will respond to any path that starts with /, which are all of them and regardless of HTTP verb used:
//      GET /
//      PUT /foo
//      POST /foo/bar
//      etc.
// app.get("/some") is intended for matching and handling a specific route when requested with the GET HTTP verb
// Within each app.get() is a call to app.use(), so you can certainly do all of this with app.use()

//app.use("/api/posts", postsRoutes);
app.use('/api/users', usersRoutes);

module.exports = app;
