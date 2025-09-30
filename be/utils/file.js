const fs = require("fs");
const path = require("path");

exports.deleteFile = (filePath) => {
		const file = "D:/HocTap/React Native/DuAn_HuyViVu/be"+ filePath;
		if (fs.existsSync(file)) { 
			fs.unlinkSync(file); 
		}
};
