const mongoes = require("mongoose");

let movieSchema = new mongoes.Schema({
    name: {
        type: String,
        required: [true, "name is required filed"],
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: [true, "name is required filed"],
        trim: true
    },
    duration: {
        type: Number,
        required: [true, "Duration is required filed"]
    },
    rating: {
        type: Number,
        default: 1.0
    },
    totalRating: {
        type: Number
    },
    releaseYear: {
        type: Number,
        required: [true, "Release year is required filed"]
    },
    genres: {
        type: [String],
        required: [true, "genres year is required filed"]
    },
    directors: {
        type: [String],
        required: [true, "directors year is required filed"]
    },
    actors: {
        type: [String],
        required: [true, "actors year is required filed"]
    },
    coverImage: {
        type: String,
        required: [true, "Cover Image is required filed"]
    },
    price: {
        type: Number,
        required: [true, "price is required filed"]
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoes.model("Movie", movieSchema);