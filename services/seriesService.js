import Series from "../models/Series.js";
import CustomError from "../utils/CustomError.js";
import ApiFeatures from "../utils/apiFeatures.js";

/* CREATE */
export const createSeries = async (data) => {
    return await Series.create(data);
};

/* GET ALL */
export const getAllSeries = async (queryString) => {
    const totalDocs = await Series.countDocuments({ isDeleted: false });

    const apiFeatures = new ApiFeatures(
        Series.find({ isDeleted: false }),
        queryString
    )
        .filter()
        .search(["name", "description"])
        .sort()
        .limitFields()
        .paginate(totalDocs);

    const series = await apiFeatures.query
        .populate("genres")
        .populate("cast");

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
