const mongoes = require("mongoose");

const movieSchema = new mongoes.Schema({
    name: {
        type: String,
        required: [true, "name is required filed"],
        unique: true
    },
    description: String,
    duration: {
        type: Number,
        required: [true, "Duration is required filed"]
    },
    rating: {
        type: Number,
        default: 1.0
    },
    releaseYear: {
        type: Number,
        required: [true, "Duration is required filed"]
    }
});

module.exports = mongoes.model("Movie", movieSchema);