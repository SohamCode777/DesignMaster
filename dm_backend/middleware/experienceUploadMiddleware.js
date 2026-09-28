
import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/experience");
    },

    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${file.originalname}`;

        cb(null, uniqueName);
    }
});


const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
        return;
    }

    cb(
        new Error(
            "Only JPG, PNG, WEBP, DOC, DOCX, and PDF files are allowed."
        )
    );
};


const upload = multer({
    storage,
    fileFilter,
    limits: {
        files: 3,
        fileSize: 10 * 1024 * 1024
    }
});


const experienceUpload = (req, res, next) => {
    upload.array("files", 3)(req, res, (error) => {

        if (!error) {
            next();
            return;
        }


        if (error instanceof multer.MulterError) {

            if (error.code === "LIMIT_FILE_SIZE") {
                return res.status(400).json({
                    message: "Each file must be 10 MB or smaller."
                });
            }

            if (error.code === "LIMIT_FILE_COUNT") {
                return res.status(400).json({
                    message: "You can upload a maximum of 3 files."
                });
            }

            if (error.code === "LIMIT_UNEXPECTED_FILE") {
                return res.status(400).json({
                    message: "Too many files were uploaded."
                });
            }

            return res.status(400).json({
                message: "File upload failed."
            });
        }


        return res.status(400).json({
            message: error.message || "File upload failed."
        });
    });
};


export default experienceUpload;

