import Series from "../models/Series.js";
import ApiFeatures from "../utils/apiFeatures.js";
import CustomError from "../utils/CustomError.js";

export const createSeries = async (data) => {
    const series = await Series.create(data);
    return series;
};

export const getAllSeries = async (queryString) => {
    const totalDocs = await Series.countDocuments();

    const apiFeatures = new ApiFeatures(Series.find(), queryString)
        .filter()
        .search(["name", "description"])
        .sort()
        .limitFields()
        .paginate(totalDocs);

    const seriesList = await apiFeatures.query.populate("genres").populate("cast");

    return {
        results: seriesList.length,
        pagination: apiFeatures.pagination,
        data: seriesList,
    };
};

export const getSeriesById = async (id) => {
    const series = await Series.findById(id)
        .populate("genres")
        .populate("cast")
        .populate("seasons");
    if (!series) throw new CustomError("Series not found", 404);
    return series;
};

export const updateSeries = async (id, data) => {
    const series = await Series.findByIdAndUpdate(id, data, { new: true });
    if (!series) throw new CustomError("Series not found", 404);
    return series;
};

export const deleteSeries = async (id) => {
    const series = await Series.findByIdAndDelete(id);
    if (!series) throw new CustomError("Series not found", 404);
    return series;
};
