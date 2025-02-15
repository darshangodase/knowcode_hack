const express = require("express");
const app = express();
const mongoose = require("mongoose");
const eWasteRoutes = require('./routes/eWasteRoutes');
const authRoutes = require('./routes/authRoutes');
const bidRoutes = require("./routes/bidRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");


const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();
app.use(express.json());

// Fix CORS configuration
app.use(cors({ 
  origin: ['https://e-wastex.netlify.app', 'http://localhost:5173','https://ewaste-x.netlify.app','https://ewastex.netlify.app','https://ewastex.kunaldev.me/'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));


mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("Connected to Mongoose");
  })
  .catch((err) => {
    console.log(err);
  });


app.use('/api/ewaste', eWasteRoutes);
app.use("/api/bid", bidRoutes); 
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use('/api/bids', bidRoutes);


app.listen(3000, () => {
  console.log(`Server is running on port ${3000}`);
});
