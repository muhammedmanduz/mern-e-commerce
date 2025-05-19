const express = require("express");
const cors = require("cors");
const bodyparser = require("body-parser");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const db = require("./config/db");
const productRoutes = require("./routes/productRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const { v2: cloudinary } = require("cloudinary");

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
app.use(cors());
app.use(
  bodyparser.json({
    limit: "30mb",
    extended: true,
  })
);
app.use(
  bodyparser.urlencoded({
    limit: "30mb",
    extended: true,
  })
);

app.use(cookieParser());

app.use("/products", productRoutes);
app.use("/user", userRoutes);

db();

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
