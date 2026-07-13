import { asyncErrorHandler } from "../middlewares/errorMiddleware.js";
import {
    createSeries,
    getAllSeries,
    getSeriesById,
    updateSeries,
    deleteSeries,
} from "../services/seriesService.js";

/* GET ALL */
export const getSeriesController = asyncErrorHandler(async (req, res) => {
    const result = await getAllSeries(req.query);

    res.status(200).json({
        status: "success",
        results: result.results,
        pagination: result.pagination,
        data: result.data,
    });
});

import Notification from "../models/Notification.js";

/* CREATE */
export const createSeriesController = asyncErrorHandler(async (req, res) => {
    if (req.files?.poster)
        req.body.poster = req.files.poster[0].path;
    if (req.files?.backdrop)
        req.body.backdrop = req.files.backdrop[0].path;

    const series = await createSeries(req.body);

    // Trigger Notification for all users
    await Notification.create({
        title: "New Series Released",
        message: `Watch the newly added series: ${series.name}`,
        type: "series",
        refId: series._id,
    });

    res.status(201).json({
        status: "success",
        data: series,
    });
});

/* GET ONE */
export const getSeriesControllerById = asyncErrorHandler(async (req, res) => {
    const series = await getSeriesById(req.params.id);

    res.status(200).json({
        status: "success",
        data: series,
    });
});

/* UPDATE */
export const updateSeriesController = asyncErrorHandler(async (req, res) => {
    const series = await updateSeries(req.params.id, req.body);

    res.status(200).json({
        status: "success",
        data: series,
    });
});

/* DELETE */
export const deleteSeriesController = asyncErrorHandler(async (req, res) => {
    await deleteSeries(req.params.id);
    await Notification.deleteMany({ refId: req.params.id });
    res.status(204).send();
});
