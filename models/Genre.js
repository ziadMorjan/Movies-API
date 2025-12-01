import mongoose from "mongoose";

const genreSchema = new mongoose.Schema(
    {
        name_en: {
            type: String,
            required: true,
            trim: true,
        },

        name_ar: String,

        type: {
            type: String,
            enum: ["movie", "series", "both"],
            default: "both",
        },
    },
    { timestamps: true }
);

export default mongoose.model("Genre", genreSchema);
