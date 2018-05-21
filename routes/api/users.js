const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

//Load input validation
const ValidateRegisterInput = require("../../validations/register");
const ValidateLoginInput = require("../../validations/login");

//Load user model
const User = require("../../models/User");

// @route  GET api/users/test
// @desc   Test users route
// @access Public
router.get("/test", (req, res) => res.json({ msg: "Users Works" }));

// @route  GET api/users/test
// @desc   Test users route
// @access Public
router.post("/register", (req, res) => {
  const { errors, isValid } = ValidateRegisterInput(req.body);
  //Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = "Email already exist";
      return res.status(400).json(errors);
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200",
        r: "pg",
        d: "mm"
      });
      const newUser = new User({
        email: req.body.email,
        name: req.body.name,
        avatar,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route  GET api/users/login
// @desc   Test users route
// @access Public
router.post("/login", (req, res) => {
  const { errors, isValid } = ValidateLoginInput(req.body);
  //Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const email = req.body.email;
  const pass = req.body.password;
  User.findOne({ email }).then(user => {
    if (!user) {
      errors.email = "User not found";
      return res.status(404).json(errors);
    }

    //check password
    bcrypt.compare(pass, user.password).then(isMatch => {
      if (isMatch) {
        //res.json({ msg: "Success" });
        const payload = {
          id: user.id,
          name: user.name,
          avatar: user.avatar
        };

        //user matched
        jwt.sign(
          payload,
          keys.secretKey,
          {
            expiresIn: 3600
          },
          (err, token) => {
            res.json({ success: true, token: "Bearer " + token });
          }
        );
      } else {
        errors.password = "Password incorecct!";
        res.status(404).json(errors);
      }
    });
  });
});

// @route  GET api/users/current
// @desc   Return current user
// @access Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ id: req.user.id, name: req.user.name, email: req.user.email });
  }
);

module.exports = router;
