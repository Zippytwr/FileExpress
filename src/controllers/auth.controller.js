const User = require("../models/user.model");
const {
  hash: hashPassword,
  compare: comparePassword,
} = require("../utils/password");
const {
  generateAccess,
  generateRefresh,
  decodeRefresh,
} = require("../utils/token");
const redisClient = require("../utils/redisClient");
const { JWT_SECRET_KEY } = require('../utils/secrets');
const jwt = require('jsonwebtoken');
const {addBlackListed} = require("../utils/blacklisted")
exports.signup = (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  const hashedPassword = hashPassword(password.trim());

  const user = new User(
    firstname.trim(),
    lastname.trim(),
    email.trim(),
    hashedPassword
  );

  User.create(user, (err, data) => {
    if (err) {
      res.status(500).send({
        status: "error",
        message: err.message,
      });
    } else {
      const access = generateAccess(data.id);
      const refresh = generateRefresh(data.id);
      res.status(201).send({
        status: "success",
        data: {
          access,
          refresh,
          data,
        },
      });
    }
  });
};

exports.signin = (req, res) => {
  const { email, password } = req.body;
  User.findByEmail(email.trim(), (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          status: "error",
          message: `User with email ${email} was not found`,
        });
        return;
      }
      res.status(500).send({
        status: "error",
        message: err.message,
      });
      return;
    }
    if (data) {
      if (comparePassword(password.trim(), data.password)) {
        const token = generateAccess(data.id);
        res.status(200).send({
          status: "success",
          data: {
            token,
            firstname: data.firstname,
            lastname: data.lastname,
            email: data.email,
          },
        });
        return;
      }
      res.status(401).send({
        status: "error",
        message: "Incorrect password",
      });
    }
  });
};

exports.refreshToken = (req, res) => {
  const { refresh } = req.body;

  if (!refresh) {
    return res.status(400).send({
      status: "error",
      message: "Refresh token is required",
    });
  }

  const decoded = decodeRefresh(refresh);

  if (!decoded || !decoded.id) {
    return res.status(401).send({
      status: "error",
      message: "Invalid or expired refresh token",
    });
  }

  const newAccessToken = generateAccess(decoded.id);

  res.status(200).send({
    status: "success",
    data: {
      access: newAccessToken,
    },
  });
};

exports.logout = async (req, res) => {
  const { refresh } = req.body;
  const response = await addBlackListed(refresh)
  res.send(response)
};
