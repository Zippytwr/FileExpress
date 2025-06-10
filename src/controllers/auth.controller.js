
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
const { addBlackListed, checkBlackListed } = require("../utils/blacklisted");

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
      return res.status(500).send({
        status: "error",
        message: err.message,
      });
    }

    const access = generateAccess(data.id);
    const refresh = generateRefresh(data.id);

    res
      .cookie("refresh", refresh, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
      })
      .status(201)
      .send({
        status: "success",
        data: {
          access,
          firstname: data.firstname,
          lastname: data.lastname,
          email: data.email,
        },
      });
  });
};

exports.signin = (req, res) => {
  const { email, password } = req.body;
  User.findByEmail(email.trim(), (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).send({
          status: "error",
          message: `User with email ${email} was not found`,
        });
      }
      return res.status(500).send({
        status: "error",
        message: err.message,
      });
    }

    if (comparePassword(password.trim(), data.password)) {
      const access = generateAccess(data.id);
      const refresh = generateRefresh(data.id);

      res
        .cookie("refresh", refresh, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "Strict",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
        })
        .status(200)
        .send({
          status: "success",
          data: {
            access,
            firstname: data.firstname,
            lastname: data.lastname,
            email: data.email,
          },
        });
    } else {
      res.status(401).send({
        status: "error",
        message: "Incorrect password",
      });
    }
  });
};

exports.refreshToken = async (req, res) => {

  const refresh = req.cookies.refresh;
  
  if (!refresh) {
    return res.status(400).send({
      status: "error",
      message: "Refresh token is required",
    });
  }

  const blacklisted = await checkBlackListed(refresh);
  if (blacklisted) {
    return res.status(401).send({
      status: "error",
      message: "Refresh token is blacklisted",
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
  const refresh = req.cookies.refresh;
  const access = req.headers.authorization?.split(" ")[1];

  if (!refresh || !access) {
    return res.status(400).send({
      status: "error",
      message: "Access and refresh tokens are required",
    });
  }

  const result = await addBlackListed(refresh, access);
  res.status(result.status === "success" ? 200 : 400).send(result);
};

