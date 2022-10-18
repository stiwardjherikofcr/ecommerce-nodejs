const multer = require("multer");
const path = require('path');

const fileFilter = (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const mimeType = fileTypes.test(file.mimetype);
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());

    if (mimeType && extName) {
        return cb(null, true);
    }
    cb(`Error: File upload only supports the following filetypes - ${fileTypes}`, false);
};

const storage = multer.diskStorage({
    destination: path.join(__dirname, '../public/img/uploads'),
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const uploadFile = multer({
    storage,
    fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 },
});

module.exports = uploadFile;