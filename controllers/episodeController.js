import { asyncErrorHandler } from "../middlewares/errorMiddleware.js";

import {
    createEpisode,
    getAllEpisodes,
    getEpisodeById,
    updateEpisode,
    deleteEpisode,
} from "../services/episodeService.js";

export const createEpisodeController = asyncErrorHandler(async (req, res) => {
    const episode = await createEpisode(req.body);

    res.status(201).json({
        status: "success",
        data: episode,
    });
});

export const getEpisodesController = asyncErrorHandler(async (req, res) => {
    const episodes = await getAllEpisodes();

    res.status(200).json({
        status: "success",
        results: episodes.length,
        data: episodes,
    });
});

export const getEpisodeController = asyncErrorHandler(async (req, res) => {
    const episode = await getEpisodeById(req.params.id);

    res.status(200).json({
        status: "success",
        data: episode,
    });
});

export const updateEpisodeController = asyncErrorHandler(async (req, res) => {
    const episode = await updateEpisode(req.params.id, req.body);

    res.status(200).json({
        status: "success",
        data: episode,
    });
});

export const deleteEpisodeController = asyncErrorHandler(async (req, res) => {
    await deleteEpisode(req.params.id);

    res.status(204).send();
});
