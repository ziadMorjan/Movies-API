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

        duration: {
            type: Number,
            min: 1,
        },

        releaseYear: {
            type: Number,
            min: 1900,
        },

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

        /** 🎥 Full movie video */
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

movieSchema.index({ name: 1 }, { unique: true });

export default mongoose.model("Movie", movieSchema);
