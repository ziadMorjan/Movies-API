import { asyncErrorHandler } from "../middlewares/errorMiddleware.js";
import {
    getEpisodes,
    getEpisodeById,
    createEpisode,
    updateEpisode,
    deleteEpisode,
} from "../services/episodeService.js";

export const getEpisodesController = asyncErrorHandler(async (req, res) => {
    const result = await getEpisodes(req.params.seasonId, req.query);

    if (!req.user) {
        result.data = result.data.map(ep => {
            ep = ep.toObject();
            delete ep.videoUrl;
            return ep;
        });
    }

    res.status(200).json({
        status: "success",
        ...result,
    });
});

export const getEpisodeController = asyncErrorHandler(async (req, res) => {
    const episode = await getEpisodeById(req.params.episodeId);

    if (!req.user) {
        const obj = episode.toObject();
        delete obj.videoUrl;

        return res.status(200).json({
            status: "success",
            data: obj,
        });
    }

    res.status(200).json({
        status: "success",
        data: episode,
    });
});


/* ================= CREATE ================= */
export const createEpisodeController = asyncErrorHandler(async (req, res) => {
    if (req.file) {
        req.body.videoUrl = req.file.path;
    }

    const episode = await createEpisode({
        ...req.body,
        series: req.params.seriesId,
        season: req.params.seasonId,
    });

    res.status(201).json({
        status: "success",
        data: episode,
    });
});

/* ================= UPDATE ================= */
export const updateEpisodeController = asyncErrorHandler(async (req, res) => {
    const episode = await updateEpisode(req.params.episodeId, req.body);

    res.status(200).json({
        status: "success",
        data: episode,
    });
});

/* ================= DELETE ================= */
export const deleteEpisodeController = asyncErrorHandler(async (req, res) => {
    await deleteEpisode(req.params.episodeId);

    res.status(204).send();
});
