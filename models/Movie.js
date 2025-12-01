import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
        },

        poster: String,
        backdrop: String,

        duration: Number,
        releaseYear: Number,

        genresRefs: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Genre",
            },
        ],

        castRefs: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Actor",
            },
        ],
    },
    { timestamps: true }
);

export default mongoose.model("Movie", movieSchema);
