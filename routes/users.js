const express = require("express");
const User = require("../models/user");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
var checkAuth = require("../middleware/auth");
const { authSchema } = require("../middleware/validation_schema");
const { $_createError } = require("@hapi/joi/lib/base");

//Request payload validation using Joi/Json schema

router.post("/signup", async (req, res, next) => {
  try {
    const result = await authSchema.validateAsync(req.body);
    const doesExist = await User.findOne({ name: result.name });
    if (doesExist)
      throw $_createError.conflict(`${result.name} is already been registered`);

    const user = new User(result);
    const savedUser = await user.save();

    res.send(savedUser);
  } catch (error) {
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
});

// Validating user using JWT Token Authentication

router.post("/login", checkAuth, function (req, res, next) {
  var username = req.body.name;
  User.find({ username: username })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        res.status(404).json({
          message: "Auth Failed",
        });
      } else {
        bcrypt.compare(
          req.body.password,
          user[0].password,
          function (err, result) {
            if (err) {
              res.status(404).json({
                message: "Auth Failed",
              });
            }
            if (result) {
              var token = jwt.sign(
                {
                  username: user[0].username,
                  userid: user[0]._id,
                },
                "secret",
                {
                  expiresIn: "1h",
                }
              );
              res.status(200).json({
                message: "Success",
                token: token,
              });
            } else {
              res.status(404).json({
                message: "Auth Failed",
              });
            }
          }
        );
      }
    })
    .catch((err) => {
      res.json({
        error: err,
      });
    });
});

router.get("/", checkAuth, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.send("Error" + err);
  }
});

router.get("/:id", checkAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (err) {
    res.send("Error" + err);
  }
});

router.post("/", checkAuth, async (req, res) => {
  const user = new User({
    name: req.body.name,
    tech: req.body.tech,
    sub: req.body.sub,
  });
  try {
    const a1 = await user.save();
    res.json(a1);
  } catch (err) {
    res.send("Error");
  }
});

router.put("/:id", checkAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.sub = req.body.sub;
    const a1 = await user.save();
    res.json(a1);
  } catch (err) {
    res.send("Error");
  }
});

module.exports = router;
