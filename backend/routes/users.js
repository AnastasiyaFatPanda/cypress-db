const express = require('express');

const User = require('../models/user');
const router = express.Router();
const ObjectId = require("mongoose").Types.ObjectId;

router.post('/create', (req, res, next) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    age: req.body.age,
  });

  user
    .save()
    .then((result) => {
      res.status(201).json({ message: 'User was created!', result });
    })
    .catch((err) => res.status(500).json({ err }));
});

router.post('/find', (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const age = req.body.age;
  const filter = [...(name && { name }), ...(email && { email }), ...(age && { age })];

  if (filter.length) {
    User.find({ $and: filter })
      .then((user) => {
        console.log(user);
        if (!user) {
          res.status(401).send({ message: 'No such user' });
        }
        res.status(200).send({ user });
      })
      .catch((_) => res.status(403).json({ message: 'Auth failed' }));
  } else {
    res.status(403).json({ message: 'Incorrect filter params' });
  }
});

router.delete("/delete", (req, res, next) => {
  User.deleteOne({ _id: new ObjectId(req.body._id) }).then(
    (result) => {
      if (result.deletedCount > 0) {
        res.status(200).json({ message: "User was deleted!" , result});
      } else {
        res.status(400).json({ message: "Nothing was deleted", result });
      }
    }
  );
});

module.exports = router;
