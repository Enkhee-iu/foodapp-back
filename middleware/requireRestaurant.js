

const UserRoleEnum = require("../utils/userRole");

const requireRestaurant = (req, res, next) => {
  if (!req.user) return res.status(401).json({ success: false, message: "Нэвтрээгүй" });
  if (req.user.role !== UserRoleEnum.RESTAURANT) {
    return res.status(403).json({ success: false, message: "Зөвхөн ресторан эзэмшигч хандах боломжтой" });
  }
  next();
};

module.exports = requireRestaurant;