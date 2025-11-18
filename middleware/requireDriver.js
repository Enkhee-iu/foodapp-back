

const UserRoleEnum = require("../utils/userRole");

const requireDriver = (req, res, next) => {
  if (!req.user) return res.status(401).json({ success: false, message: "Нэвтрээгүй" });
  if (req.user.role !== UserRoleEnum.DRIVER) {
    return res.status(403).json({ success: false, message: "Зөвхөн жолооч хандах боломжтой" });
  }
  next();
};

module.exports = requireDriver;