const jwt = require("jsonwebtoken");
const genererToken = (user, statusCode = 201, res) => {
  // G n rer un token

  // Créer le token
  const token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: "1h" });

  const options = {
    expires: new Date(
      Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRE) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    data: user,
  });

  // Exclure le mot de passe de la réponse
  user.password = undefined;

  return {
    token,
    options,
    user,
    statusCode,
  };
};

module.exports = genererToken;
