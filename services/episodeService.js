import Episode from "../models/Episode.js";
import ApiFeatures from "../utils/apiFeatures.js";
import CustomError from "../utils/CustomError.js";

export const createEpisode = async (data) => {
    const episode = await Episode.create(data);
    return episode;
};

export const getAllEpisodes = async (queryString) => {
    const totalDocs = await Episode.countDocuments();

    const apiFeatures = new ApiFeatures(Episode.find(), queryString)
        .filter()
        .search(["title", "overview"])
        .sort()
        .limitFields()
        .paginate(totalDocs);

    const episodes = await apiFeatures.query
        .populate("series")
        .populate("season");

    return {
        results: episodes.length,
        pagination: apiFeatures.pagination,
        data: episodes,
    };
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
