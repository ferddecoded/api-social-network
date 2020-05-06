const express = require('express');

const router = express.Router();

// @route   GET /posts
// @desc    Test route
// @access  Public
router.get('/', (req, res) => {
  res.send('Posts Router');
});

module.exports = router;
