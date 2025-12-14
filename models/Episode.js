import mongoose from "mongoose";

const episodeSchema = new mongoose.Schema(
    {
        series: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Series",
            required: true,
            index: true,
        },

        season: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Season",
            required: true,
            index: true,
        },

        episodeNumber: {
            type: Number,
            required: true,
            min: 1,
        },

        title: {
            type: String,
            required: true,
            trim: true,
        },

        overview: String,

        runtime: {
            type: Number,
            min: 1,
        },

        /** ✅ NEW */
        videoUrl: {
            type: String,
            required: true,
        },

        isDeleted: {
            type: Boolean,
            default: false,
            index: true,
        },
    },
    { timestamps: true }
);

// Unique episode number per season
episodeSchema.index(
    { season: 1, episodeNumber: 1 },
    { unique: true }
);

export default mongoose.model("Episode", episodeSchema);
