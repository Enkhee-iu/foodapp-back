const UserModel = require("../../schemas/userSchema");

const getSingleUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(404).json({ error: "User not found" });
  }
};

module.exports = getSingleUser;
