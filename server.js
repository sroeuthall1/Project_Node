require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const Category = require("./src/routes/categoryRoute");
const Brand = require("./src/routes/brandRoute");
const Product = require("./src/routes/productRoute");
const User = require("./src/routes/userRoute");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

Category(app);
Brand(app);
Product(app);
User(app);

app.listen(5500, function () {
    console.log("Server is running on http://localhost:5500");
});