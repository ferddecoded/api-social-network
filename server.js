const express = require('express');
const connectDB = require('./config/db');
const path = require('path');

require('dotenv').config();

const app = express();

// Connect Database
connectDB();

// Init Middleware
// this will allow us to get the data in req.body
app.use(express.json({ extended: false }));

// Define routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/posts', require('./routes/posts'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // set static folder name
  app.use(express.static.apply('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  })
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
