import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },

        email: { type: String, required: true, unique: true },

        password: {
            type: String,
            required: true,
            select: false,
        },

        photo: { type: String, default: "" },

        role: {
            type: String,
            enum: ["admin", "user"],
            default: "user",
        },

        authProvider: {
            type: String,
            enum: ["local", "google", "facebook"],
            default: "local",
        },

        active: { type: Boolean, default: true },

        resetToken: String,
        resetTokenExpired: Date,
        passwordChangedAt: Date,
        favorites: [
            {
                item: {
                    type: mongoose.Schema.Types.ObjectId,
                    refPath: "favorites.itemType",
                },
                itemType: {
                    type: String,
                    enum: ["Movie", "Series"],
                },
                addedAt: { type: Date, default: Date.now },
            },
        ],
    },
    { timestamps: true }
);

userSchema.pre("save", function (next) {
    if (!this.isModified("password")) return next();
    this.password = bcryptjs.hashSync(this.password, 10);
    this.confirmPassword = undefined;
    next();
});

userSchema.pre(/^find/, function (next) {
    this.find({ active: { $ne: false } });
    next();
});

userSchema.methods.generatePasswordResetToken = function () {
    const token = crypto.randomBytes(32).toString("hex");

    this.resetToken = crypto.createHash("sha256").update(token).digest("hex");

    this.resetTokenExpired = Date.now() + 10 * 60 * 1000;

    return token;
};

export default mongoose.model("User", userSchema);
