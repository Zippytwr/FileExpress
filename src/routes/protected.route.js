const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authHandler");

router.get("/profile", authMiddleware, (req, res) => {
  res.send({
    status: "success",
    data: {
      message: "This is protected route",
      user: req.user, // ID или другая информация из токена
    },
  });
});

module.exports = router;
