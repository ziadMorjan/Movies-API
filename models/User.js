import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

let userSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },

        email: { type: String, required: true, unique: true },

        password: {
            type: String,
            required: true,
            select: false, // hide password
        },

        photo: { type: String, default: "" },

        role: {
            type: String,
            enum: ["admin", "user"],
            default: "user",
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

        createdAt: { type: Date, default: Date.now },
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

    this.resetToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    this.resetTokenExpired = Date.now() + 10 * 60 * 1000; // 10 min

    return token; // غير مشفر - نرسله للمستخدم بالإيميل
};

export default mongoose.model("User", userSchema);
