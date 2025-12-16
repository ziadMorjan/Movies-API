import Series from "../models/Series.js";
import CustomError from "../utils/CustomError.js";
import ApiFeatures from "../utils/apiFeatures.js";

/* CREATE */
export const createSeries = async (data) => {
    return await Series.create(data);
};

/* GET ALL */
export const getAllSeries = async (queryString) => {
    const filter = { isDeleted: false };
    if (queryString._id) {
        filter._id = {
            $in: queryString._id.split(","),
        };
    }

    if (queryString.genre) {
        filter.genresRefs = { $in: queryString.genre.split(",") };
    }

    if (queryString.actor) {
        filter.castRefs = { $in: queryString.actor.split(",") };
    }
    const totalDocs = await (new ApiFeatures(Series.find(filter), queryString)
        .filter()
        .search(["name"])
        .query
        .countDocuments());

    const apiFeatures = new ApiFeatures(
        Series.find(filter),
        queryString
    )
        .filter()
        .search(["name"])
        .sort()
        .limitFields()
        .paginate(totalDocs);

    const series = await apiFeatures.query

    return {
        results: series.length,
        pagination: apiFeatures.pagination,
        data: series,
    };
};

/* GET ONE */
export const getSeriesById = async (id) => {
    const series = await Series.findOne({
        _id: id,
        isDeleted: false,
    })
        .populate("genres")
        .populate("cast");

    if (!series)
        throw new CustomError("Series not found", 404);

    return series;
};

/* UPDATE */
export const updateSeries = async (id, data) => {
    const series = await Series.findOneAndUpdate(
        { _id: id, isDeleted: false },
        data,
        { new: true, runValidators: true }
    );

    if (!series)
        throw new CustomError("Series not found", 404);

    return series;
};

/* SOFT DELETE */
export const deleteSeries = async (id) => {
    const series = await Series.findOneAndUpdate(
        { _id: id, isDeleted: false },
        { isDeleted: true },
        { new: true }
    );

    if (!series)
        throw new CustomError("Series not found", 404);

    return series;
};
