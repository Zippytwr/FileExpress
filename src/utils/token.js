const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = require('../utils/secrets');
const { logger } = require('./logger');

const generateAccess = (id) => jwt.sign({ id }, JWT_SECRET_KEY, { expiresIn: '1d'});
const generateRefresh = (id) => jwt.sign({id}, JWT_SECRET_KEY, {expiresIn: '30d'})


const decode = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET_KEY)
    } catch (error) {
        logger.error(error);
    }
};

module.exports = {
    generateAccess,
    generateRefresh,
    decode
}