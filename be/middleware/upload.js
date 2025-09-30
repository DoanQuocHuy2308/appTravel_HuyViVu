const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../public/images/"));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname));
    },
});

const deleteFile = (filePath) => {
		const file = "D:/HocTap/React Native/DuAn_HuyViVu/be/"+ filePath;
		if (fs.existsSync(file)) { 
			fs.unlinkSync(file); 
		}
	}

const upload = multer({
    storage: storage,
});

module.exports = { upload, deleteFile };
