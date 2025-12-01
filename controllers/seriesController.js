import { asyncErrorHandler } from "../middlewares/errorMiddleware.js";

import {
    createSeries,
    getAllSeries,
    getSeriesById,
    updateSeries,
    deleteSeries,
} from "../services/seriesService.js";

export const createSeriesController = asyncErrorHandler(async (req, res) => {
    const series = await createSeries(req.body);

    res.status(201).json({
        status: "success",
        data: series,
    });
});

export const getSeriesController = asyncErrorHandler(async (req, res) => {
    const seriesList = await getAllSeries();

    res.status(200).json({
        status: "success",
        results: seriesList.length,
        data: seriesList,
    });
});

export const getSingleSeriesController = asyncErrorHandler(
    async (req, res) => {
        const series = await getSeriesById(req.params.id);

        res.status(200).json({
            status: "success",
            data: series,
        });
    }
);

export const updateSeriesController = asyncErrorHandler(async (req, res) => {
    const series = await updateSeries(req.params.id, req.body);

    res.status(200).json({
        status: "success",
        data: series,
    });
});

export const deleteSeriesController = asyncErrorHandler(async (req, res) => {
    await deleteSeries(req.params.id);

    res.status(204).send();
});
