import mongoose from "mongoose";

const episodeSchema = new mongoose.Schema(
    {
        series: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Series",
            required: true,
        },

        season: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Season",
            required: true,
        },

        episodeNumber: {
            type: Number,
            required: true,
        },

        title: {
            type: String,
            required: true,
        },

        overview: String,
        runtime: Number,
        videoUrl: String,
    },
    { timestamps: true }
);

export default mongoose.model("Episode", episodeSchema);
