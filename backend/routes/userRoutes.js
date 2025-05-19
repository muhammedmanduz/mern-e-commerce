const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  userDetail,
} = require("../controllers/userController");
const { authenticationMiddleware } = require("../middleware/auth");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.post("/forgotPassword", forgotPassword);
router.put("/resetPassword/:token", resetPassword); // token parametresi ile gelen resetPassword fonksiyonu
router.get("/me", authenticationMiddleware, userDetail); // kullanıcı detayını döndüren fonksiyon

module.exports = router;
