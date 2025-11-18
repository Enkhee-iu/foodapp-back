

const UserRoleEnum = require("../utils/userRole");

const requireUser = (req, res, next) => {
  if (!req.user) return res.status(401).json({ success: false, message: "Нэвтрээгүй" });
  
  next();
};

module.exports = requireUser;