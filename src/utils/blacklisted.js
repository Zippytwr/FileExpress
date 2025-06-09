const redisClient = require("./redisClient");
const { JWT_SECRET_KEY } = require("./secrets");
const jwt = require("jsonwebtoken");

const addBlackListed = async (refresh) => {
  if (!refresh) {
    return res
      .status(400)
      .send({ status: "error", message: "Refresh token is required" });
  }

  try {
    const decoded = jwt.verify(refresh, JWT_SECRET_KEY + "reffer");

    const now = Math.floor(Date.now() / 1000);
    const tokenTTL = decoded.exp - now;

    if (tokenTTL <= 0) {
      return res
        .status(400)
        .send({ status: "error", message: "Refresh token is expired" });
    }

    await redisClient.set(refresh, "blacklisted", { EX: tokenTTL });

    const value = await redisClient.get(refresh);
    console.log("Stored in Redis:", value);

    return {
      status: "success",
      message: "Logged out and tokens invalidated",
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      message: "Invalid refresh token",
    };
  }
};
module.exports = {
  addBlackListed,
};
