const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images")
    },
    filename: (req, file, cb) => {
        const originalFilename = file.originalname
        const uniqueFilename = `${Date.now()}-${originalFilename}`
        cb(null, uniqueFilename)
    }
});

const publicUpload = multer({ storage })

module.exports = publicUpload;
