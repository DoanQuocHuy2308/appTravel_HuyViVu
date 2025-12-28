const path = require("path");
const fs = require("fs");
const multer = require("multer");

// Cấu hình lưu file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../public/images/"));
    },
    filename: function (req, file, cb) {
        cb(
            null,
            Date.now() +
                "-" +
                Math.round(Math.random() * 1e9) +
                path.extname(file.originalname)
        );
    },
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(
        path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error("Chỉ cho phép upload ảnh"));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
});

const deleteFile = (filePath) => {
    try {
        // Nếu filePath đã chứa '/public/images/', chỉ cần xóa phần đó
        let actualPath;
        if (filePath.startsWith('/public/images/')) {
            actualPath = path.join(__dirname, "..", filePath);
        } else {
            actualPath = path.join(__dirname, "../public/images/", filePath);
        }
        
        console.log('Attempting to delete file:', actualPath);
        
        if (fs.existsSync(actualPath)) {
            fs.unlinkSync(actualPath);
            console.log('File deleted successfully:', actualPath);
        } else {
            console.log('File not found:', actualPath);
        }
    } catch (error) {
        console.error('Error deleting file:', error);
    }
};

module.exports = { upload, deleteFile };
