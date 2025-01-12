const dotenv = require("dotenv");
dotenv.config({ path: "./../config.env" });
const fs = require("fs");
const conectToDb = require("./../config/conectToDb");
const Movie = require("./../models/Movie");

// connect to db 
conectToDb(process.env.CON_STR);

// read movies from json file
let movies = JSON.parse(fs.readFileSync("./movies.json"));

async function deleteDocs() {
    try {
        await Movie.deleteMany();
        console.log("document deleted successfuly");
    } catch (error) {
        console.log(error.message);
    }
    process.exit();
}

async function importDocs() {
    try {
        await Movie.create(movies);
        console.log("document imported successfuly");
    } catch (error) {
        console.log(error.message);
    }
    process.exit();
}

if (process.argv[2] == "--import") {
    importDocs();
}
if (process.argv[2] == "--delete") {
    deleteDocs();
}
