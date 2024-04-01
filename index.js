const mongoose = require("mongoose");

// Import express
const express = require("express");
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/UserDetails')
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// Middleware for CORS headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:2000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Import and use user route
const userRoute = require("./routes/userRoutes");
app.use('/', userRoute);

// Import and use admin route
const adminRoute = require("./routes/adminRoute");
app.use('/admin', adminRoute);

// Port setting
const port = process.env.PORT || 2021;

// Redirect to appropriate route
app.get('*', (req, res) => {
  if (req.session.user_id) {
    res.redirect('/home');
  } else {
    res.redirect('/');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running @ http://localhost:${port}`);
  console.log(`Server running @ http://localhost:${port}/admin`);
});
