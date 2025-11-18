const User = require("../../schemas/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");


const signUp = async (req, res) => {
  try {
    const { firstName, email, password } = req.body;

    const existed = await User.findOne({ email: email.toLowerCase() });
    if (existed) {
      return res.status(400).json({
        success: false,
        message: "Имэйл аль хэдийн бүртгэлтэй",
      });
    }

    const hashed = await bcrypt.hash(password, 12);

    const user = await User.create({
      firstName,
      email: email.toLowerCase(),
      password: hashed,
    });

    const accessToken = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

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
    res.status(500).json({ success: false, message: err.message });
  }
};


const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

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

    const accessToken = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

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
    res.status(500).json({ success: false, message: err.message });
  }
};


const refreshToken = async (req, res) => {
  try {
    const token = req.headers["x-refresh-token"] || req.cookies?.refreshToken;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Refresh token байхгүй" });
    }

    const decoded = jwt.verify(token, process.env.REFRESH_SECRET);

    const newAccessToken = jwt.sign(
      { _id: decoded._id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.json({ success: true, accessToken: newAccessToken });
  } catch (err) {
    res.status(401).json({ success: false, message: "Refresh token хүчингүй" });
  }
};


const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(400).json({ success: false, message: "Имэйл олдсонгүй" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetToken = resetToken;
    user.resetTokenExpire = Date.now() + 1000 * 60 * 10; 
    await user.save();

    res.json({
      success: true,
      message: "Нууц үг солих хүсэлт амжилттай",
      resetToken,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const verifyResetToken = async (req, res) => {
  try {
    const token = req.query.token;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Token буруу эсвэл хугацаа дууссан",
      });
    }

    res.json({ success: true, message: "Token хүчинтэй" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Token хугацаа дууссан эсвэл буруу",
      });
    }

    const hashed = await bcrypt.hash(newPassword, 12);
    user.password = hashed;

    user.resetToken = undefined;
    user.resetTokenExpire = undefined;

    await user.save();

    res.json({ success: true, message: "Нууц үг амжилттай солигдлоо" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


module.exports = {
  signUp,
  signIn,
  refreshToken,
  requestPasswordReset,
  verifyResetToken,
  resetPassword,
};
