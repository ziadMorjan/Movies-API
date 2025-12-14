import mongoose from "mongoose";

const seriesSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
        },

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

        isDeleted: {
            type: Boolean,
            default: false,
            index: true,
        },
    },
    { timestamps: true }
);

seriesSchema.index({ name: 1 }, { unique: true });

export default mongoose.model("Series", seriesSchema);
