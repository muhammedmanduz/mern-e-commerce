const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;

//kayıt olma işlemi
const registerUser = async (req, res) => {
  const avatar = await cloudinary.uploader.upload(req.body.avatar, {
    folder: "avatars",
    width: 150,
    crop: "scale",
  });

  const { name, email, password } = req.body;

  // kullanıcıdan gelen user bilgilerini alıyoruz
  let user = await User.findOne({ email });
  if (user) {
    return res.status(500).json({ message: "User already exists!" });
  }

  //hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  if (password.length < 6) {
    return res
      .status(500)
      .json({ message: "Password must be at least 6 characters!" });

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      avatar: {
        public_id: avatar.public_id,
        url: avatar.secure_url,
      },
    });

    //token oluşturma
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    //cookie oluşturma
    const cookieOptions = {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    res.status(201).cookie("token", token, cookieOptions).json({
      success: true,
      message: "User registered successfully!",
      user: newUser,
    });
  }
};

//giriş yapma işlemi
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // kullanıcıdan gelen user bilgilerini alıyoruz
  let user = await User.findOne({ email });
  if (!user) {
    return res.status(500).json({ message: "User not found!" });
  }
  //karşılaştırma işlemi
  const comparePassword = await bcrypt.compare(password, user.password);

  if (!comparePassword) {
    return res.status(500).json({ message: "Invalid credentials!" });
  }

  //token oluşturma
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  //cookie oluşturma
  const cookieOptions = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  res.status(200).cookie("token", token, cookieOptions).json({
    success: true,
    message: "User logged in successfully!",
    user,
  });
};

//çıkış yapma işlemi
const logoutUser = async (req, res) => {
  //token sürelerini belirleyip,  cookiden silme işlemi yapacağız (kullanıcıyı çıkış yaptırıyoruz)
  const cookieOptions = {
    expires: new Date(Date.now()),
    httpOnly: true,
  };

  res.status(200).cookie("token", null, cookieOptions).json({
    success: true,
    message: "User logged out successfully!",
  });
};

//şifre sıfırlama işlemi
const forgotPassword = async (req, res) => {};

//şifre sıfırlama işlemi
const resetPassword = async (req, res) => {};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
};
