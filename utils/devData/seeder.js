const dotenv = require("dotenv");
dotenv.config({ path: "./../../config.env" });
const fs = require("fs");
const db = require("./../../config/db");
const Movie = require("./../../models/Movie");
const Users = require("./../../models/User");
const User = require("./../../models/User");

// connect to db 
db.connect(process.env.CON_STR);

// read movies from json file
let movies = JSON.parse(fs.readFileSync("./movies.json"));
let users = JSON.parse(fs.readFileSync("./users.json"));

async function deleteDocs() {
    try {
        await Movie.deleteMany();
        await User.deleteMany();
        console.log("document deleted successfully");
    } catch (error) {
        console.log(error.message);
    }
    process.exit();
}

async function importDocs() {
    try {
        await Movie.create(movies);
        await User.create(users);
        console.log("document imported successfully");
    } catch (error) {
        console.log(error.message);
    }
    process.exit();
}

if (process.argv[2] == "-i") {
    importDocs();
}
if (process.argv[2] == "-d") {
    deleteDocs();
}
