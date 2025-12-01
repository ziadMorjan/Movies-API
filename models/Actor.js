import mongoose from "mongoose";

const actorSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        profilePath: String,
        popularity: Number,
        tmdbId: Number,
    },
    { timestamps: true }
);

export default mongoose.model("Actor", actorSchema);
