const redisClient = require("./redisClient");
const { JWT_SECRET_KEY } = require("./secrets");
const jwt = require("jsonwebtoken");

const addBlackListed = async (refresh, access) => {
  if (!refresh || !access) {
    return {
      status: "error",
      message: "Access and refresh tokens are required",
    };
  }

  try {
    // Расшифровываем refresh
    const decodedRefresh = jwt.verify(refresh, JWT_SECRET_KEY + "reffer");
    const decodedAccess = jwt.verify(access, JWT_SECRET_KEY);

    const now = Math.floor(Date.now() / 1000);
    const refreshTTL = decodedRefresh.exp - now;
    const accessTTL = decodedAccess.exp - now;

    if (refreshTTL <= 0 || accessTTL <= 0) {
      return {
        status: "error",
        message: "One or both tokens are already expired",
      };
    }

    // Сохраняем в Redis оба токена
    await redisClient.set(refresh, "blacklisted", { EX: refreshTTL });
    await redisClient.set(access, "blacklisted", { EX: accessTTL });

    return {
      status: "success",
      message: "Access and refresh tokens invalidated",
    };
  } catch (error) {
    console.error("Token verification error:", error);
    return {
      status: "error",
      message: "Invalid access or refresh token",
    };
  }
};
const checkBlackListed = async (refresh) => {
  const isBlacklisted = await redisClient.get(refresh);
  if (isBlacklisted) {
    return true;
  }
  return false;
};
module.exports = {
  addBlackListed,
  checkBlackListed,
};
