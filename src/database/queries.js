const { DB_NAME } = require("../utils/secrets");

const createDB = `CREATE DATABASE IF NOT EXISTS ${DB_NAME}`;

const dropDB = `DROP DATABASE IF EXISTS ${DB_NAME}`;

const createTableUsers = `
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    firstname VARCHAR(50) NULL,
    lastname VARCHAR(50) NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_on TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
)
`;

const createNewUser = `
INSERT INTO users VALUES(null, ?, ?, ?, ?, NOW())
`;

const findUserByEmail = `
SELECT * FROM users WHERE email = ?
`;

// --- FILES ---
const createTableFiles = `
CREATE TABLE IF NOT EXISTS files (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    extension VARCHAR(20) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    size INT NOT NULL,
    path VARCHAR(255) NOT NULL,
    uploaded_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at TIMESTAMP(6) NULL
)
`;

const createFile = `
INSERT INTO files (name, extension, mime_type, size, path, uploaded_at)
VALUES (?, ?, ?, ?, ?, ?)
`;

const getFileById = `
SELECT * FROM files WHERE id = ?
`;

const getAllFiles = `
SELECT * FROM files ORDER BY uploaded_at DESC LIMIT ? OFFSET ?
`;

const deleteFileById = `
DELETE FROM files WHERE id = ?
`;

const updateFile = `
UPDATE files
SET name = ?, extension = ?, mime_type = ?, size = ?, path = ?, updated_at = ?
WHERE id = ?
`;

module.exports = {
  createDB,
  dropDB,
  createTableUsers,
  createNewUser,
  findUserByEmail,

  createTableFiles,
  createFile,
  getFileById,
  getAllFiles,
  deleteFileById,
  updateFile,
};
