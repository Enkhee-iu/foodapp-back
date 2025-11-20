const { Schema, model } = require("mongoose");
const UserRoleEnum = require("../utils/userRole");

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      default: "",
      // minLength: [2, "Нэр дор хаяж 2 үсэгтэй байх ёстой"],
      // maxLength: [50, "Нэр 50 үсгээс ихгүй байх ёстой"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Имэйл заавал оруулна уу"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Нууц үг заавал оруулна уу"],
      minlength: 6,
    },

    phoneNumber: {
      type: String,
      trim: true,
    },

    address: {
      type: String,
      trim: true,
    },

    role: {
      type: String,
      enum: Object.values(UserRoleEnum),
      default: UserRoleEnum.USER,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.index({ role: 1 });

module.exports = model("User", UserSchema);
