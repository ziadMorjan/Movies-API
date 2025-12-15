import Episode from "../models/Episode.js";
import ApiFeatures from "../utils/apiFeatures.js";
import CustomError from "../utils/CustomError.js";

export const getEpisodes = async (seasonId, queryString) => {
    const filter = { season: seasonId, isDeleted: false };

    const totalDocs = await Episode.countDocuments(filter);

    const apiFeatures = new ApiFeatures(Episode.find(filter), queryString)
        .filter()
        .search(["title"])
        .sort()
        .limitFields()
        .paginate(totalDocs);

    const episodes = await apiFeatures.query;

    return {
        results: episodes.length,
        pagination: apiFeatures.pagination,
        data: episodes,
    };
};

export const getEpisodeById = async (id) => {
    const episode = await Episode.findOne({ _id: id, isDeleted: false });
    if (!episode) throw new CustomError("Episode not found", 404);
    return episode;
};


/* ================= CREATE ================= */
export const createEpisode = async (data) => {
    return await Episode.create(data);
};

/* ================= UPDATE ================= */
export const updateEpisode = async (id, data) => {
    const episode = await Episode.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });

    if (!episode) throw new CustomError("Episode not found", 404);
    return episode;
};

/* ================= DELETE (SOFT) ================= */
export const deleteEpisode = async (id) => {
    const episode = await Episode.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { new: true }
    );

    if (!episode) throw new CustomError("Episode not found", 404);
    return episode;
};
