const express = require("express");
const router = express.Router();

const {
  signUp,
  signIn,
  refreshToken,
  requestPasswordReset,
  verifyResetToken,
  resetPassword
} = require("../controllers/user/authController");

router.post("/sign-up", signUp);
router.post("/sign-in", signIn);
router.post("/refresh", refreshToken);
router.post("/reset-password-request", requestPasswordReset);
router.get("/verify-reset-password-request", verifyResetToken);
router.post("/reset-password", resetPassword);


module.exports = router;
