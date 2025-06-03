// middleware/minFileSize.js
const minFileSize = (minSizeInBytes) => {
  return (req, res, next) => {
    if (!req.file) return next(); // multer file error already handled

    if (req.file.size < minSizeInBytes) {
      // Delete the uploaded file because it does not meet size requirement
      const fs = require('fs');
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Failed to delete file:', err);
      });

      return res.status(400).json({ message: `File size must be at least ${minSizeInBytes / (1024*1024)} MB` });
    }
    next();
  };
};

module.exports = minFileSize;
