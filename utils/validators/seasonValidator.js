import { body, param } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";
import CustomError from "../../utils/CustomError.js";
import Series from "../../models/Series.js";
import Season from "../../models/Season.js";

/* ================= PARAMS ================= */
export const seriesIdValidator = [
    param("seriesId")
        .isMongoId()
        .withMessage("Invalid series ID"),
    validatorMiddleware,
];

export const seasonIdValidator = [
    param("seasonId")
        .isMongoId()
        .withMessage("Invalid season ID"),
    validatorMiddleware,
];

/* ================= CREATE ================= */
export const createSeasonValidator = [
    body("seasonNumber")
        .notEmpty()
        .isInt({ min: 1 })
        .withMessage("seasonNumber must be >= 1")
        .custom(async (seasonNumber, { req }) => {
            const series = await Series.findOne({
                _id: req.params.seriesId,
                isDeleted: false,
            });
            if (!series) throw new CustomError("Series not found", 404);

            const exists = await Season.findOne({
                series: req.params.seriesId,
                seasonNumber,
                isDeleted: false,
            });
            if (exists)
                throw new CustomError(
                    "Season number already exists in this series",
                    400
                );

            return true;
        }),

    body("poster")
        .optional()
        .isString()
        .withMessage("Poster must be a string"),

    body("overview")
        .optional()
        .isString(),

    validatorMiddleware,
];

/* ================= UPDATE ================= */
export const updateSeasonValidator = [
    body("seasonNumber")
        .optional()
        .isInt({ min: 1 })
        .custom(async (seasonNumber, { req }) => {
            const exists = await Season.findOne({
                series: req.params.seriesId,
                seasonNumber,
                _id: { $ne: req.params.seasonId },
                isDeleted: false,
            });
            if (exists)
                throw new CustomError(
                    "Season number already exists in this series",
                    400
                );
            return true;
        }),

    body("poster")
        .optional()
        .isString(),

    body("overview")
        .optional()
        .isString(),

    validatorMiddleware,
];
