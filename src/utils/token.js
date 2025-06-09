const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = require('../utils/secrets');
const { logger } = require('./logger');
const {v4: uuidv4} = require("uuid")

const generateAccess = (id) => jwt.sign({ id, jti: uuidv4() }, JWT_SECRET_KEY, { expiresIn: '1d' });
const generateRefresh = (id) => jwt.sign({ id, jti: uuidv4() }, JWT_SECRET_KEY + "reffer", { expiresIn: '30d' });

const decodeAccess = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET_KEY);
    } catch (error) {
        logger.error(error);
        return null;
    }
};

const decodeRefresh = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET_KEY + "reffer");
    } catch (error) {
        logger.error(error);
        return null;
    }
};

module.exports = {
    generateAccess,
    generateRefresh,
    decodeAccess,
    decodeRefresh
}