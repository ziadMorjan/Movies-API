import { body, param } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";
import CustomError from "../../utils/CustomError.js";
import Episode from "../../models/Episode.js";
import Season from "../../models/Season.js";

/* ================= PARAM VALIDATORS ================= */
export const seriesIdValidator = [
    param("seriesId").isMongoId().withMessage("Invalid series ID"),
    validatorMiddleware,
];

export const seasonIdValidator = [
    param("seasonId").isMongoId().withMessage("Invalid season ID"),
    validatorMiddleware,
];

export const episodeIdValidator = [
    param("episodeId").isMongoId().withMessage("Invalid episode ID"),
    validatorMiddleware,
];

/* ================= CREATE ================= */
export const createEpisodeValidator = [
    body("episodeNumber")
        .notEmpty()
        .isInt({ min: 1 })
        .withMessage("episodeNumber must be >= 1")
        .custom(async (episodeNumber, { req }) => {
            const season = await Season.findOne({
                _id: req.params.seasonId,
                series: req.params.seriesId,
                isDeleted: false,
            });
            if (!season) throw new CustomError("Season not found", 404);

            const exists = await Episode.findOne({
                season: req.params.seasonId,
                episodeNumber,
                isDeleted: false,
            });
            if (exists)
                throw new CustomError(
                    "Episode number already exists in this season",
                    400
                );
            return true;
        }),

    body("title")
        .notEmpty()
        .withMessage("Episode title is required"),

    body("videoUrl")
        .notEmpty()
        .withMessage("Video URL is required")
        .isURL()
        .withMessage("Invalid video URL"),

    body("runtime")
        .optional()
        .isInt({ min: 1 }),

    body("overview")
        .optional()
        .isString(),

    validatorMiddleware,
];

/* ================= UPDATE ================= */
export const updateEpisodeValidator = [
    body("episodeNumber")
        .optional()
        .isInt({ min: 1 })
        .custom(async (episodeNumber, { req }) => {
            const exists = await Episode.findOne({
                season: req.params.seasonId,
                episodeNumber,
                _id: { $ne: req.params.episodeId },
                isDeleted: false,
            });
            if (exists)
                throw new CustomError(
                    "Episode number already exists in this season",
                    400
                );
            return true;
        }),

    body("title").optional().isString(),

    body("videoUrl")
        .optional()
        .isURL()
        .withMessage("Invalid video URL"),

    body("runtime")
        .optional()
        .isInt({ min: 1 }),

    body("overview")
        .optional()
        .isString(),

    validatorMiddleware,
];
