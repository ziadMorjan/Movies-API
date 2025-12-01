import Episode from "../models/Episode.js";
import CustomError from "../utils/CustomError.js";

export const createEpisode = async (data) => {
    const episode = await Episode.create(data);
    return episode;
};

export const getAllEpisodes = async () => {
    const episodes = await Episode.find()
        .populate("series")
        .populate("season");
    return episodes;
};

export const getEpisodeById = async (id) => {
    const episode = await Episode.findById(id)
        .populate("series")
        .populate("season");
    if (!episode) throw new CustomError("Episode not found", 404);
    return episode;
};

export const updateEpisode = async (id, data) => {
    const episode = await Episode.findByIdAndUpdate(id, data, { new: true });
    if (!episode) throw new CustomError("Episode not found", 404);
    return episode;
};

export const deleteEpisode = async (id) => {
    const episode = await Episode.findByIdAndDelete(id);
    if (!episode) throw new CustomError("Episode not found", 404);
    return episode;
};
