const User = require("../../schemas/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const checkEmail = async (req, res) => {
  try {
    const { email } = req.body;

    console.log("STEP1 EMAIL:", email);

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Имэйл ирсэнгүй",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Имэйл формат буруу байна",
      });
    }

    const existed = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existed) {
      return res.status(409).json({
        success: false,
        message: "Имэйл бүртгэлтэй байна",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Имэйлийг ашиглаж болно",
    });
  } catch (err) {
    console.log("CHECK EMAIL ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

const signUp = async (req, res) => {
  try {
    console.log("STEP2 BODY:", req.body);

    const { firstName, email, password } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Имэйл шаардлагатай",
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Нууц үг шаардлагатай",
      });
    }

    const existed = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existed) {
      return res.status(409).json({
        success: false,
        message: "Имэйл бүртгэлтэй байна",
      });
    }

    const hashed = await bcrypt.hash(password, 12);

    const user = await User.create({
      firstName: firstName || "",
      email: email.toLowerCase().trim(),
      password: hashed,
    });

    const accessToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    const refreshToken = jwt.sign(
      { _id: user._id },
      process.env.REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      success: true,
      message: "Амжилттай бүртгэгдлээ!",
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        firstName: user.firstName,
        email: user.email,
        role: user.role || "user",
      },
    });
  } catch (err) {
    console.log("SIGN-UP ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Имэйл эсвэл нууц үг дутуу байна",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Имэйл эсвэл нууц үг буруу",
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({
        success: false,
        message: "Имэйл эсвэл нууц үг буруу",
      });
    }

    const accessToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    const refreshToken = jwt.sign(
      { _id: user._id },
      process.env.REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Амжилттай нэвтэрлээ!",
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        firstName: user.firstName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.log("SIGN-IN ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  checkEmail,
  signUp,
  signIn,
};
