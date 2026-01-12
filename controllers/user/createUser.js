const UserModel = require("../../schemas/userSchema");
const bcrypt = require("bcryptjs");

const createUser = async (req, res) => {
  try {
    const { firstName, email, password, address, phoneNumber } = req.body;

    let hashedPassword = password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 12);
    }

    const data = await UserModel.create({
      firstName,
      email,
      password: hashedPassword,
      address,
      phoneNumber,
    });

    res.json({
      message: "User created successfully!",
      data: data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = createUser;
