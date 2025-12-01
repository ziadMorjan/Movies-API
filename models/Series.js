import mongoose from "mongoose";

const seriesSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        description: String,

        poster: String,
        backdrop: String,

        genres: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Genre",
            },
        ],

        cast: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Actor",
            },
        ],
    },
    { timestamps: true }
);

export default mongoose.model("Series", seriesSchema);
