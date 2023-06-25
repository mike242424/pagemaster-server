const { model, Schema } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      default: null,
      unique: true,
    },
    password: { type: String },
    token: { type: String },
  },
  { timestamps: true }
);

module.exports = model("User", userSchema);
