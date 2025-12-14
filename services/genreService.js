import Genre from "../models/Genre.js";
import ApiFeatures from "../utils/apiFeatures.js";
import CustomError from "../utils/CustomError.js";

export const createGenre = async (data) => {
    const genre = await Genre.create(data);
    return genre;
};

export const getAllGenres = async (queryString) => {
    const totalDocs = await Genre.countDocuments();

    const apiFeatures = new ApiFeatures(Genre.find(), queryString)
        .filter()
        .search(["name_en"])
        .sort()
        .limitFields()
        .paginate(totalDocs);

    const genres = await apiFeatures.query;

    return {
        results: genres.length,
        pagination: apiFeatures.pagination,
        data: genres,
    };
};

export const getGenreById = async (id) => {
    const genre = await Genre.findById(id);
    if (!genre) throw new CustomError("Genre not found", 404);
    return genre;
};

export const updateGenre = async (id, data) => {
    const genre = await Genre.findByIdAndUpdate(id, data, { new: true });
    if (!genre) throw new CustomError("Genre not found", 404);
    return genre;
};

export const deleteGenre = async (id) => {
    const genre = await Genre.findByIdAndDelete(id);
    if (!genre) throw new CustomError("Genre not found", 404);
    return genre;
};
