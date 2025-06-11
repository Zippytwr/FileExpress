const db = require('../config/db.config');
const { logger } = require('../utils/logger');
const {
  createFileQuery,
  getFileByIdQuery,
  getAllFilesQuery,
  deleteFileByIdQuery,
  updateFileQuery
} = require('../database/queries');

class File {
  constructor(name, extension, mime_type, size, path) {
    this.name = name;
    this.extension = extension;
    this.mime_type = mime_type;
    this.size = size;
    this.path = path;
    this.uploaded_at = new Date();
  }

  static create(newFile, cb) {
    db.query(createFileQuery, [
      newFile.name,
      newFile.extension,
      newFile.mime_type,
      newFile.size,
      newFile.path,
      newFile.uploaded_at
    ], (err, res) => {
      if (err) {
        logger.error(err.message);
        cb(err, null);
        return;
      }
      cb(null, { id: res.insertId, ...newFile });
    });
  }

  static getById(id, cb) {
    db.query(getFileByIdQuery, [id], (err, res) => {
      if (err) {
        logger.error(err.message);
        cb(err, null);
        return;
      }
      if (res.length) {
        cb(null, res[0]);
        return;
      }
      cb({ kind: "not_found" }, null);
    });
  }

  static getAll({ page = 1, list_size = 10 }, cb) {
    const offset = (page - 1) * list_size;
    db.query(getAllFilesQuery, [list_size, offset], (err, res) => {
      if (err) {
        logger.error(err.message);
        cb(err, null);
        return;
      }
      cb(null, res);
    });
  }

  static deleteById(id, cb) {
    db.query(deleteFileByIdQuery, [id], (err, res) => {
      if (err) {
        logger.error(err.message);
        cb(err, null);
        return;
      }
      cb(null, res);
    });
  }

  static updateById(id, updatedFile, cb) {
    db.query(updateFileQuery, [
      updatedFile.name,
      updatedFile.extension,
      updatedFile.mime_type,
      updatedFile.size,
      updatedFile.path,
      new Date(),
      id
    ], (err, res) => {
      if (err) {
        logger.error(err.message);
        cb(err, null);
        return;
      }
      cb(null, res);
    });
  }
}

module.exports = File;
