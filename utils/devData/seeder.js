import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { connect } from "../../config/db.js";

import Movie from "../../models/Movie.js";
import Series from "../../models/Series.js";
import Season from "../../models/Season.js";
import Episode from "../../models/Episode.js";
import Genre from "../../models/Genre.js";
import Actor from "../../models/Actor.js";
import User from "../../models/User.js";

// ESM path fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../../config.env") });

connect(process.env.CON_STR);

// =============== Load JSON files ===============

const readJSON = (file) =>
    JSON.parse(fs.readFileSync(path.join(__dirname, file)));

const movies = readJSON("movies.json");
const seriesList = readJSON("series.json");
const seasons = readJSON("seasons.json");
const episodes = readJSON("episodes.json");
const genresArray = readJSON("genres.json");
const actorsArray = readJSON("actors.json");
const users = readJSON("users.json");

// =================================================
// Helper: Generate maps
// =================================================

async function importData() {
    try {
        console.log("🚀 Importing data...");

        // 1) Insert genres
        const genreDocs = await Genre.insertMany(
            genresArray.map((g) => ({
                name_en: g,
                type: "both"
            }))
        );

        const genreMap = {};
        genreDocs.forEach((g) => (genreMap[g.name_en] = g._id));

        // 2) Insert actors
        const actorDocs = await Actor.insertMany(
            actorsArray.map((a) => ({ name: a }))
        );

        const actorMap = {};
        actorDocs.forEach((a) => (actorMap[a.name] = a._id));

        // 3) Insert series (no refs yet)
        const seriesDocs = await Series.insertMany(
            seriesList.map((s) => ({
                name: s.name,
                description: s.description,
                poster: s.poster,
                backdrop: s.backdrop,
                genres: s.genres.map((name) => genreMap[name]),
                cast: s.cast.map((name) => actorMap[name]),
            }))
        );

        const seriesMap = {};
        seriesDocs.forEach((s) => (seriesMap[s.name] = s._id));

        // 4) Insert seasons (linked to series)
        const seasonDocs = await Season.insertMany(
            seasons.map((s) => ({
                series: seriesMap[s.series],
                seasonNumber: s.seasonNumber,
                poster: s.poster,
                overview: s.overview,
            }))
        );

        // Build lookup for (seriesName + seasonNumber)
        const seasonLookup = {};
        seasonDocs.forEach((s) => {
            seasonLookup[`${s.series}-${s.seasonNumber}`] = s._id;
        });

        // 5) Insert episodes (linked to series + season)
        const episodeDocs = await Episode.insertMany(
            episodes.map((ep) => ({
                series: seriesMap[ep.series],
                season: seasonLookup[`${seriesMap[ep.series]}-${ep.seasonNumber}`],
                episodeNumber: ep.episodeNumber,
                title: ep.title,
                overview: ep.overview,
                runtime: ep.runtime,
                videoUrl: ep.videoUrl,
            }))
        );

        // 6) Insert movies
        const movieDocs = await Movie.insertMany(
            movies.map((m) => ({
                name: m.name,
                description: m.description,
                duration: m.duration,
                releaseYear: m.releaseYear,
                poster: m.poster,
                backdrop: m.backdrop,
                genresRefs: m.genres.map((g) => genreMap[g]),
                castRefs: m.cast.map((a) => actorMap[a]),
            }))
        );

        // 7) Insert users
        await User.insertMany(users);

        console.log("🎉 All data imported successfully!");
        process.exit();
    } catch (err) {
        console.error("❌ Error importing data:", err);
        process.exit(1);
    }
}

async function deleteData() {
    try {
        await Movie.deleteMany();
        await Series.deleteMany();
        await Season.deleteMany();
        await Episode.deleteMany();
        await Genre.deleteMany();
        await Actor.deleteMany();
        await User.deleteMany();

        console.log("🗑 All data deleted!");
        process.exit();
    } catch (err) {
        console.error("❌ Error deleting data:", err);
        process.exit(1);
    }
}

if (process.argv[2] === "-i") importData();
if (process.argv[2] === "-d") deleteData();
