const mongoes = require("mongoose");
const fs = require("fs");
const validator = require("validator");

let movieSchema = new mongoes.Schema({
    name: {
        type: String,
        required: [true, "name is required filed"],
        unique: true,
        trim: true,
        validate: [validator.isAlphanumeric(), "name must contain alphabet & numbers only"]
    },
    description: {
        type: String,
        required: [true, "name is required filed"],
        trim: true
    },
    duration: {
        type: Number,
        required: [true, "Duration is required filed"]
    },
    rating: {
        type: Number,
        default: 1.0,
        validate: {
            validator: function (value) {
                return value >= 1 && value <= 10;
            },
            message: "ratings must be greater than 1 & less than 10"
        }
    },
    totalRating: {
        type: Number
    },
    releaseYear: {
        type: Number,
        required: [true, "Release year is required filed"]
    },
    genres: {
        type: [String],
        required: [true, "genres year is required filed"]
    },
    directors: {
        type: [String],
        required: [true, "directors year is required filed"]
    },
    actors: {
        type: [String],
        required: [true, "actors year is required filed"]
    },
    coverImage: {
        type: String,
        required: [true, "Cover Image is required filed"]
    },
    price: {
        type: Number,
        required: [true, "price is required filed"]
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

movieSchema.virtual("durationInHours").get(function () {
    return this.duration / 60;
});

movieSchema.post("save", function (doc, next) {
    let content = `${doc.name} is added by Ziad\n`;
    fs.appendFileSync("./log/log.txt", content);
    next();
});

movieSchema.pre(/^find/, function (next) {
    this.find({ releaseYear: { $lte: new Date().getFullYear() } })
    next();
});

movieSchema.pre("aggregate", function (next) {
    this.pipeline().unshift({ $match: { releaseYear: { $lte: new Date().getFullYear() } } });
    next();
});

module.exports = mongoes.model("Movie", movieSchema);