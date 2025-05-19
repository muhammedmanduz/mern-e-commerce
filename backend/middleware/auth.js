const User = require("../models/user");
const jwt = require("jsonwebtoken");

//kişinini giriş yapıp yapmadığını,tokenının olup olmadığının geçerli olmad durumunu  kontrol eden fonksiyon middleware
const authenticationMiddleware = async (req, res, next) => {
  // kullanıcıdan gelen token bilgisini alıyoruz
  const { token } = req.cookies.token;

  // token bilgisini kontrol ediyoruz
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // token bilgisini doğruluyoruz
  try {
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decodedData.id);
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

// admin middleware
const roleChecked = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "You do not have permission to enter" });
    }
    next();
  };
};

module.exports = { authenticationMiddleware, roleChecked };
