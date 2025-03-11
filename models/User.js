const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");

let userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "first name is required field"],
    },
    lastName: {
        type: String,
        required: [true, "last name is required field"],
    },
    email: {
        type: String,
        unique: true,
        required: [true, "email is required field"],
        validation: [validator.isEmail, "pleas enter valid email"]
    },
    password: {
        type: String,
        required: [true, "password is required field"],
        minlength: [8, "password length must be larger than 8 characters"],
        select: false
    },
    confirmPassword: {
        type: String,
        required: [true, "password is required field"],
        minlength: [8, "password length must be larger than 8 characters"],
        validate: {
            validator: function (val) {
                return this.password == val;
            },
            message: "password & confirm password fields are not same"
        }
    },
    photo: {
        type: String,
        default: ""
    }
});

userSchema.pre("save", function (next) {
    if (!this.isModified("password")) return next();

    this.password = bcryptjs.hashSync(this.password, 10);
    this.confirmPassword = undefined;

    next();
});

module.exports = mongoose.model("User", userSchema);