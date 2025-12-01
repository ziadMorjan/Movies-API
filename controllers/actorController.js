import { asyncErrorHandler } from "../middlewares/errorMiddleware.js";

import {
    createActor,
    getAllActors,
    getActorById,
    updateActor,
    deleteActor,
} from "../services/actorService.js";

export const createActorController = asyncErrorHandler(async (req, res) => {
    const actor = await createActor(req.body);

    res.status(201).json({
        status: "success",
        data: actor,
    });
});

export const getActorsController = asyncErrorHandler(async (req, res) => {
    const actors = await getAllActors();

    res.status(200).json({
        status: "success",
        results: actors.length,
        data: actors,
    });
});

export const getActorController = asyncErrorHandler(
    async (req, res) => {
        const actor = await getActorById(req.params.id);

        res.status(200).json({
            status: "success",
            data: actor,
        });
    }
);

export const updateActorController = asyncErrorHandler(async (req, res) => {
    const actor = await updateActor(req.params.id, req.body);

    res.status(200).json({
        status: "success",
        data: actor,
    });
});

export const deleteActorController = asyncErrorHandler(async (req, res) => {
    await deleteActor(req.params.id);

    res.status(204).send();
});
