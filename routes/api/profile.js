const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

const Profile = require("../../models/Profile");
const User = require("../../models/User");

//Load Validation
const validateProfileInput = require("../../validations/profile");

const validateExperienceInput = require("../../validations/experience");

const validateEducationInput = require("../../validations/education");
// @route  GET api/profile/test
// @desc   Test profile route
// @access Public
router.get("/test", (req, res) => res.json({ msg: "Profile Works" }));

// @route  GET api/profile
// @desc   Current profile information
// @access PRivate
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id })
      .populate("user", ["name", "avatar"])
      .then(profile => {
        if (!profile) {
          errors.noprofile = "There is no profile for this user";
          return res.status(404).json(errors);
        } else {
          res.json(profile);
        }
      })
      .catch(err => res.status(404).json(err));
  }
);


// @route  POST api/profile/handle/:handle
// @desc   Get profile by handle
// @access Public

router.get('/handle/:handle', (req, res) => {
  const errors = {};
  Profile.findOne({ handle: req.params.handle })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'No profile';
        res.status(400).json(errors);

      }
      res.json(profile);
    })
    .catch(err => res.status(400).json(err));
});

// @route  POST api/profile/user/:user_id
// @desc   Get profile by handle
// @access Public

router.get('/user/:user_id', (req, res) => {
  const errors = {};
  Profile.findOne({ user: req.params.user_id })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'No profile';
        res.status(400).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(400).json({ profile: 'No profile' }));
});


// @route  GET api/profile/all
// @desc   Get all profiles
// @access Public

router.get('/all', (req, res) => {
  const errors = {};
  Profile.find()
    .populate("user", ["name", "avatar"])
    .then(profiles => {
      if (!profiles) {
        errors.noprofile = 'No profiles';
        res.status(404).json(errors);
      }
      res.json(profiles);
    })
    .catch(err => res.status(400).json({ profile: 'No profile' }));
});


// @route  POST api/profile
// @desc   Create or Edit profile information
// @access Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);

    //Check Validation
    if (!isValid) {
      //Return any errors with 400 status
      return res.status(400).json(errors);
    }

    //Get fileds
    const profileFields = {};

    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername)
      profileFields.githubusername = req.body.githubusername;

    if (typeof req.body.skills !== "undefined") {
      profileFields.skills = req.body.skills.split(",");
    }

    //Social
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;

    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        //Update
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then(profile => res.json(profile));
      } else {
        //Create

        //Check if handle exist
        Profile.findOne({ handle: profileFields.handle }).then(profile => {
          if (profile) {
            errors.handle = "Handle already exist";
            res.status(404).json(errors);
          }

          //Save profile
          new Profile(profileFields).save().then(profile => res.json(profile));
        });
      }
    });
  }
);

// @route  POST api/profile/experience
// @desc   Create or Edit profile information
// @access Private
router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {

    const { errors, isValid } = validateExperienceInput(req.body);

    //Check Validation
    if (!isValid) {
      //Return any errors with 400 status
      return res.status(400).json(errors);
    }


    Profile.findOne({ user: req.user.id })
      .then(profile => {
        const newExp = {
          title: req.body.title,
          company: req.body.company,
          location: req.body.location,
          from: req.body.from,
          to: req.body.to,
          current: req.body.current,
          description: req.body.description
        }

        profile.experience.unshift(newExp);

        profile.save().then(profile => res.json(profile));

      })
  }
);

// @route  POST api/profile/experience
// @desc   Create or Edit profile information
// @access Private
router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {

    const { errors, isValid } = validateEducationInput(req.body);

    //Check Validation
    if (!isValid) {
      //Return any errors with 400 status
      return res.status(400).json(errors);
    }

    console.log(1);
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        const newEdu = {
          school: req.body.school,
          degree: req.body.degree,
          fieldOfStudy: req.body.fieldofstudy,
          from: req.body.from,
          to: req.body.to,
          current: req.body.current,
          description: req.body.description
        }
        console.log(newEdu);
        profile.education.unshift(newEdu);

        profile.save().then(profile => res.json(profile));

      })
  }
);


// @route  DELETE api/profile/experience/:exp_id
// @desc   Delete EXP from profile
// @access Private
router.delete(
  "/experience/:exp_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {

    console.log(1);
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        //Get remove index
        const removeIndex = profile.experience
          .map(item => item.id)
          .indexOf(req.params.exp_id);

        if (removeIndex == -1) {
          return res.status(404).json({ education: 'Education not found' });
        }
        // Splice out from array
        profile.experience.splice(removeIndex, 1);

        //Save 
        profile.save().then(profile => res.json(profile))
      }).catch(err => res.status(400).json(err));
  }
);


// @route  DELETE api/profile/education/:exp_id
// @desc   Delete EXP from profile
// @access Private
router.delete(
  "/education/:edu_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {

    console.log(1);
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        //Get remove index
        const removeIndex = profile.education
          .map(item => item.id)
          .indexOf(req.params.edu_id);
        if (removeIndex == -1) {
          return res.status(404).json({ education: 'Education not found' });
        }
        // Splice out from array
        profile.education.splice(removeIndex, 1);

        //Save 
        profile.save().then(profile => res.json(profile))
      }).catch(err => res.status(400).json(err));
  }
);


// @route  DELETE profile and user
// @desc   
// @access Private
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({ user: req.user.id })
      .then(() => {
        User.findOneAndRemove({ _id: req.user.id }).then(() => res.json({ success: true }))
      });
  }
);



module.exports = router;
