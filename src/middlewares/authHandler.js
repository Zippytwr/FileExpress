const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = require("../utils/secrets");

function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      status: "error",
      message: "Access token is missing or invalid",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    req.user = decoded; // доступ к payload (например, user.id)
    next();
  } catch (err) {
    return res.status(403).json({
      status: "error",
      message: "Access token is expired or invalid",
    });
  }
}

module.exports = authMiddleware;
