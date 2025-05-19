const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const crypto = require("crypto");
const nodemailer = require("nodemailer");

//!kayıt olma işlemi
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

//!giriş yapma işlemi
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

//!çıkış yapma işlemi
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

//!şifre sıfırlama işlemi
const forgotPassword = async (req, res) => {
  //kullanıcıdan gelen user bilgilerini alıyoruz
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(500).json({ message: "User not found!" });
  }

  //token oluşturma
  const resetToken = crypto.randomBytes(20).toString("hex");

  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  //token süresini belirliyoruz
  user.resetPasswordExpire = new Date(Date.now() + 30 * 60 * 1000);
  await user.save({ validateBeforeSave: false });

  //şifre sıfırlama linki:http://localhost:4000/user/resetpassword/123456789
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/user/resetpassword/${resetToken}`;

  const message = `Şifre sıfırlama talebinde bulundunuz. Lütfen aşağıdaki linke tıklayarak şifrenizi sıfırlayın:\n\n ${resetUrl}`;

  try {
    //nodemailer ile mail gönderme işlemi
    const transporter = nodemailer.createTransport({
      port: 465,
      host: "smtp.gmail.com",
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
      secure: true,
    });

    const mailData = {
      from: process.env.GMAIL_USER,
      to: req.body.email,
      subject: "Şifre Sıfırlama Talebi",
      text: message,
    };

    await transporter.sendMail(mailData);

    res.status(200).json({
      success: true,
      message:
        "Şifre sıfırlama linki başarıyla gönderildi ,mailinizi kontrol edin!",
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return res.status(500).json({
      success: false,
      message: "Mail gönderilirken bir hata oluştu!",
    });
  }
};

//!şifre sıfırlama işlemi
const resetPassword = async (req, res) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
};
