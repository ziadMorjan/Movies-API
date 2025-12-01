import mongoose from "mongoose";

const seasonSchema = new mongoose.Schema(
    {
        series: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Series",
            required: true,
        },

        seasonNumber: {
            type: Number,
            required: true,
        },

        poster: String,
        overview: String,
    },
    { timestamps: true }
);

export default mongoose.model("Season", seasonSchema);
