const express = require('express');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth.js');

const router = express.Router();

const Profile = require('../models/Profile');
const User = require('../models/User');

// @route   GET /profile/me
// @desc    Get current users profile
// @access  Private
// private because we are getting the profile by token
router.get('/me', auth, async (req, res) => {
  try {
    // user property pertains to the user field in Profile schema
    // which is the object id of that user
    const profile = await Profile.findOne({ user: req.user.id })
      // populate is used to bring in data from user field
      .populate('user', ['name', 'avatar']);

    if (!profile) {
      res.status(400).json({ msg: 'There is no profile for this user' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   Post /profile/
// @desc    create or update user profile
// @access  Private
// use array, for multiple middlewares
router.post(
  '/',
  [
    auth,
    check('status', 'Stauts is required')
      .not()
      .isEmpty(),
    check('skills', 'Skills is required')
      .not()
      .isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      location,
      website,
      bio,
      skills,
      status,
      githubusername,
      youtube,
      twitter,
      instagram,
      linkedin,
      facebook,
    } = req.body;

    // Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(',').map(skill => skill.trim());
    }

    // Build social object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        // Update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        return res.json(profile);
      }

      // Create
      profile = new Profile(profileFields);

      await profile.save();
      res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET /profile
// @desc    Get all profiles
// @access  Public

router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /profile/user/:user_id
// @desc    Get specific profile by id
// @access  Public

router.get('/user/:user_id', async (req, res) => {
  try {
    // find profile by id
    // ensure user property only has name and vatar properties returned
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return res.status(400).json({ msg: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    // catches it if the id is incorrect, and returns appropriate error
    if (error.message.indexOf('ObjectId') !== -1) {
      return res.status(400).json({ msg: 'Profile not found.' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
