import { asyncErrorHandler } from "../middlewares/errorMiddleware.js";
import {
    createSeason,
    getSeasonsBySeries,
    getSeasonById,
    updateSeason,
    deleteSeason,
} from "../services/seasonService.js";

/* GET ALL */
export const getSeasonsController = asyncErrorHandler(async (req, res) => {
    const result = await getSeasonsBySeries(req.params.seriesId, req.query);

    res.status(200).json({
        status: "success",
        results: result.results,
        pagination: result.pagination,
        data: result.data,
    });
});

/* CREATE */
export const createSeasonController = asyncErrorHandler(async (req, res) => {
    const season = await createSeason(req.params.seriesId, req.body);

    res.status(201).json({
        status: "success",
        data: season,
    });
});

/* GET ONE */
export const getSeasonController = asyncErrorHandler(async (req, res) => {
    const season = await getSeasonById(
        req.params.seriesId,
        req.params.seasonId
    );

    res.status(200).json({
        status: "success",
        data: season,
    });
});

/* UPDATE */
export const updateSeasonController = asyncErrorHandler(async (req, res) => {
    const season = await updateSeason(
        req.params.seriesId,
        req.params.seasonId,
        req.body
    );

    res.status(200).json({
        status: "success",
        data: season,
    });
});

/* DELETE */
export const deleteSeasonController = asyncErrorHandler(async (req, res) => {
    await deleteSeason(req.params.seriesId, req.params.seasonId);
    res.status(204).send();
});
