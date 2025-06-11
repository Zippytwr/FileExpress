const File = require('../models/file.model');

exports.uploadFile = (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send({
      status: 'error',
      message: 'No file uploaded',
    });
  }

  const newFile = {
    name: file.originalname,
    extension: file.mimetype.split('/')[1],
    mime_type: file.mimetype,
    size: file.size,
  }
    File.create(newFile, (err, data) => {
        if (err) {
        return res.status(500).send({
            status: 'error',
            message: err.message || 'Some error occurred while uploading the file.',
        });
        }
        res.status(201).send({
        status: 'success',
        data: {
            id: data.id,
            name: data.name,
            extension: data.extension,
            mime_type: data.mime_type,
            size: data.size,
        },
        });
    });
}
