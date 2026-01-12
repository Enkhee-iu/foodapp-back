const UserModel = require("../../schemas/userSchema");
const bcrypt = require("bcryptjs");

const updateUser = async (req, res) => {
  try {
    const updates = { ...req.body };

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 12);
    }

    const user = await UserModel.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = updateUser;
