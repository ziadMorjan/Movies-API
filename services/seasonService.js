import Season from "../models/Season.js";
import Series from "../models/Series.js";
import CustomError from "../utils/CustomError.js";
import ApiFeatures from "../utils/apiFeatures.js";

/* CREATE */
export const createSeason = async (seriesId, data) => {
    const series = await Series.findOne({ _id: seriesId, isDeleted: false });
    if (!series) throw new CustomError("Series not found", 404);

    return await Season.create({ ...data, series: seriesId });
};

/* GET ALL (by series) */
export const getSeasonsBySeries = async (seriesId, queryString) => {
    const totalDocs = await Season.countDocuments({
        series: seriesId,
        isDeleted: false,
    });

    const apiFeatures = new ApiFeatures(
        Season.find({ series: seriesId, isDeleted: false }),
        queryString
    )
        .filter()
        .sort()
        .limitFields()
        .paginate(totalDocs);

    const seasons = await apiFeatures.query;

    return {
        results: seasons.length,
        pagination: apiFeatures.pagination,
        data: seasons,
    };
};

/* GET ONE */
export const getSeasonById = async (seriesId, seasonId) => {
    const season = await Season.findOne({
        _id: seasonId,
        series: seriesId,
        isDeleted: false,
    });

    if (!season) throw new CustomError("Season not found", 404);
    return season;
};

/* UPDATE */
export const updateSeason = async (seriesId, seasonId, data) => {
    const season = await Season.findOneAndUpdate(
        { _id: seasonId, series: seriesId, isDeleted: false },
        data,
        { new: true, runValidators: true }
    );

    if (!season) throw new CustomError("Season not found", 404);
    return season;
};

/* SOFT DELETE */
export const deleteSeason = async (seriesId, seasonId) => {
    const season = await Season.findOneAndUpdate(
        { _id: seasonId, series: seriesId, isDeleted: false },
        { isDeleted: true },
        { new: true }
    );

    if (!season) throw new CustomError("Season not found", 404);
    return season;
};
