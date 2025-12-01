import Series from "../models/Series.js";
import CustomError from "../utils/CustomError.js";

export const createSeries = async (data) => {
    const series = await Series.create(data);
    return series;
};

export const getAllSeries = async () => {
    const series = await Series.find();
    return series;
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
