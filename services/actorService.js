import Actor from "../models/Actor.js";
import CustomError from "../utils/CustomError.js";

export const createActor = async (data) => {
    const actor = await Actor.create(data);
    return actor;
};

export const getAllActors = async () => {
    const actors = await Actor.find();
    return actors;
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
