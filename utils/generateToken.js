const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      username: user.username,
    },
    process.env.SECRET_KEY,
    {
      expiresIn: "4h",
    }
  );
};

module.exports = generateToken;
