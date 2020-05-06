const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const config = require('config');
const auth = require('../middleware/auth');

const router = express.Router();
const User = require('../models/User');

// @route   GET /auth
// @desc    Test route
// @access  Public

// auth is used as a middleware to retrieve jwt token from req and decode it
router.get('/', auth, async (req, res) => {
  try {
    // req.user.id was set from the auth middleware to be the token
    // we append .select with argument <-argument> to not return the password
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /auth
// @desc    Authenticate user and get token
// @access  Public
router.post(
  '/',
  [
    check('email', 'please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // See if user exists
      const user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials' }] });
      }

      // make sure password matches
      const isMatched = await bcrypt.compare(password, user.password);

      if (!isMatched) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials' }] });
      }

      // Return jsonwebtoken

      const payload = {
        user: {
          // although in mongoDb, this is _id, mongoose abstracts that so you can just use .id
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 3600 },
        (err, token) => {
          if (err) {
            throw err;
          }
          res.json({ token });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
