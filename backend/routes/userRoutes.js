const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
} = require("../controllers/userController");

const router = express.Router();

router.post("/register", registerUser);

module.exports = router;
