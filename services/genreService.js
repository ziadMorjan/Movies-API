import Genre from "../models/Genre.js";
import CustomError from "../utils/CustomError.js";

export const createGenre = async (data) => {
    const genre = await Genre.create(data);
    return genre;
};

export const getAllGenres = async () => {
    const genres = await Genre.find();
    return genres;
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
