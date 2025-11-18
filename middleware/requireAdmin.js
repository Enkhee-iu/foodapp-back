

const UserRoleEnum = require("../utils/userRole");

const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Нэвтрээгүй байна" });
  }
  if (req.user.role !== UserRoleEnum.ADMIN) {
    return res.status(403).json({ success: false, message: "Зөвхөн админ хандах эрхтэй" });
  }
  next();
};

module.exports = requireAdmin;