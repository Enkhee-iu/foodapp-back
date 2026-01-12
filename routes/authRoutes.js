const express = require("express");
const { signIn } = require("../controllers/user/authController");

const router = express.Router();

// LOGIN
router.post("/login", signIn);

module.exports = router;
