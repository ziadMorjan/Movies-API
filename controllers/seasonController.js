import { asyncErrorHandler } from "../middlewares/errorMiddleware.js";

import {
    createSeason,
    getAllSeasons,
    getSeasonById,
    updateSeason,
    deleteSeason,
} from "../services/seasonService.js";

export const createSeasonController = asyncErrorHandler(async (req, res) => {
    const season = await createSeason(req.body);

    res.status(201).json({
        status: "success",
        data: season,
    });
});

export const getSeasonsController = asyncErrorHandler(async (req, res) => {
    const seasons = await getAllSeasons();

    res.status(200).json({
        status: "success",
        results: seasons.length,
        data: seasons,
    });
});

export const getSeasonController = asyncErrorHandler(async (req, res) => {
    const season = await getSeasonById(req.params.id);

    res.status(200).json({
        status: "success",
        data: season,
    });
});

export const updateSeasonController = asyncErrorHandler(async (req, res) => {
    const season = await updateSeason(req.params.id, req.body);

    res.status(200).json({
        status: "success",
        data: season,
    });
});

export const deleteSeasonController = asyncErrorHandler(async (req, res) => {
    await deleteSeason(req.params.id);

    res.status(204).send();
});
