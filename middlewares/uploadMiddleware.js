import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
import CustomError from "../utils/CustomError.js";

/* ================= IMAGE UPLOAD ================= */
const imageStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "movies-app/images",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        transformation: [{ quality: "auto" }],
    },
});

export const uploadImage = multer({
    storage: imageStorage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith("image"))
            cb(new CustomError("Images only allowed", 400), false);
        cb(null, true);
    },
});

/* ================= VIDEO UPLOAD ================= */
const videoStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "movies-app/videos",
        resource_type: "video",
    },
});

export const uploadVideo = multer({
    storage: videoStorage,
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith("video"))
            cb(new CustomError("Videos only allowed", 400), false);
        cb(null, true);
    },
});
