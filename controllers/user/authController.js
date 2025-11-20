const User = require("../../schemas/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// ---------------- SIGN UP ----------------
const signUp = async (req, res) => {
  try {
    console.log("REQ BODY:", req.body); // 📌 DEBUG — email ирж байна уу?

    const { firstName, email, password } = req.body;

    // ---------------- VALIDATION ----------------
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email ирсэнгүй",
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password ирсэнгүй",
      });
    }

    // ---------------- CHECK IF USER EXISTS ----------------
    const existed = await User.findOne({ email: email.toLowerCase() });

    if (existed) {
      return res.status(400).json({
        success: false,
        message: "Имэйл аль хэдийн бүртгэлтэй",
      });
    }

    // ---------------- HASH PASSWORD ----------------
    const hashed = await bcrypt.hash(password, 12);

    const user = await User.create({
      firstName: firstName || "",
      email: email.toLowerCase(),
      password: hashed,
    });

    // ---------------- JWT TOKENS ----------------
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
    console.log("SIGN-UP ERROR:", err); // 📌 DEBUG
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---------------- SIGN IN ----------------
const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Имэйл эсвэл нууц үг дутуу байна",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Имэйл эсвэл нууц үг буруу" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res
        .status(400)
        .json({ success: false, message: "Имэйл эсвэл нууц үг буруу" });

    const accessToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    const refreshToken = jwt.sign(
      { _id: user._id },
      process.env.REFRESH_SECRET,
      {
        expiresIn: "7d",
      }
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
  signUp,
  signIn,
};
