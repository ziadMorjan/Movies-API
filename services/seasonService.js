import Season from "../models/Season.js";
import CustomError from "../utils/CustomError.js";

export const createSeason = async (data) => {
    const season = await Season.create(data);
    return season;
};

export const getAllSeasons = async () => {
    const seasons = await Season.find().populate("series");
    return seasons;
};

export const getSeasonById = async (id) => {
    const season = await Season.findById(id).populate("series");
    if (!season) throw new CustomError("Season not found", 404);
    return season;
};

export const updateSeason = async (id, data) => {
    const season = await Season.findByIdAndUpdate(id, data, { new: true });
    if (!season) throw new CustomError("Season not found", 404);
    return season;
};

export const deleteSeason = async (id) => {
    const season = await Season.findByIdAndDelete(id);
    if (!season) throw new CustomError("Season not found", 404);
    return season;
};
