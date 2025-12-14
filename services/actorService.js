import Actor from "../models/Actor.js";
import ApiFeatures from "../utils/apiFeatures.js";
import CustomError from "../utils/CustomError.js";

export const createActor = async (data) => {
    const actor = await Actor.create(data);
    return actor;
};

export const getAllActors = async (queryString) => {
    const totalDocs = await Actor.countDocuments();

    const apiFeatures = new ApiFeatures(Actor.find(), queryString)
        .filter()
        .search(["name"])
        .sort()
        .limitFields()
        .paginate(totalDocs);

    const actors = await apiFeatures.query;

    return {
        results: actors.length,
        pagination: apiFeatures.pagination,
        data: actors,
    };
};

export const getActorById = async (id) => {
    const actor = await Actor.findById(id);
    if (!actor) throw new CustomError("Actor not found", 404);
    return actor;
};

export const updateActor = async (id, data) => {
    const actor = await Actor.findByIdAndUpdate(id, data, { new: true });
    if (!actor) throw new CustomError("Actor not found", 404);
    return actor;
};

export const deleteActor = async (id) => {
    const actor = await Actor.findByIdAndDelete(id);
    if (!actor) throw new CustomError("Actor not found", 404);
    return actor;
};
