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
import { errorLogger } from "../logger.js";

/* ================= ESM PATH FIX ================= */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../../config.env") });

connect(process.env.CON_STR);

/* ================= LOAD JSON ================= */

const readJSON = (file) =>
    JSON.parse(fs.readFileSync(path.join(__dirname, file), "utf-8"));

const movies = readJSON("movies.json");
const seriesList = readJSON("series.json");
const seasons = readJSON("seasons.json");
const episodes = readJSON("episodes.json");
const genresArray = readJSON("genres.json");
const actorsArray = readJSON("actors.json");
const users = readJSON("users.json");

/* ================= HELPERS ================= */

const toIdMap = (docs, key) =>
    docs.reduce((acc, doc) => {
        acc[doc[key]] = doc._id;
        return acc;
    }, {});

function ensure(value, message) {
    if (!value) throw new Error(message);
    return value;
}

/* ================= IMPORT DATA ================= */

async function importData() {
    try {
        console.log("[seed] Importing data (existing records will be removed)...");
        await clearCollections();

        /* ===== GENRES ===== */
        const genreDocs = await Genre.create(
            genresArray.map((g) => ({
                name_en: typeof g === "string" ? g : g.name,
                type: "both",
            }))
        );
        const genreMap = toIdMap(genreDocs, "name_en");

        /* ===== ACTORS ===== */
        const actorDocs = await Actor.create(
            actorsArray.map((a) => ({
                name: typeof a === "string" ? a : a.name,
            }))
        );
        const actorMap = toIdMap(actorDocs, "name");

        /* ===== SERIES ===== */
        const seriesDocs = await Series.create(
            seriesList.map((s) => ({
                name: s.name,
                description: s.description,
                poster: s.poster,
                backdrop: s.backdrop,
                genres: (s.genres || []).map((g) =>
                    ensure(genreMap[g], `Unknown genre "${g}" for series "${s.name}"`)
                ),
                cast: (s.cast || []).map((a) =>
                    ensure(actorMap[a], `Unknown actor "${a}" for series "${s.name}"`)
                ),
            }))
        );
        const seriesMap = toIdMap(seriesDocs, "name");

        /* ===== SEASONS ===== */
        const seasonDocs = await Season.create(
            seasons.map((s) => {
                const seriesId = ensure(
                    seriesMap[s.series],
                    `Unknown series "${s.series}" for season ${s.seasonNumber}`
                );
                return {
                    series: seriesId,
                    seasonNumber: s.seasonNumber,
                    poster: s.poster,
                    overview: s.overview,
                };
            })
        );
        const seasonLookup = {};
        seasonDocs.forEach((s) => {
            seasonLookup[`${String(s.series)}-${s.seasonNumber}`] = s._id;
        });

        /* ===== EPISODES ===== */
        await Episode.create(
            episodes.map((ep) => {
                const seriesId = ensure(
                    seriesMap[ep.series],
                    `Unknown series "${ep.series}" for episode "${ep.title}"`
                );
                const seasonNumber = ep.season ?? ep.seasonNumber;
                const seasonId = ensure(
                    seasonLookup[`${seriesId}-${seasonNumber}`],
                    `Unknown season ${seasonNumber} for episode "${ep.title}"`
                );

                return {
                    series: seriesId,
                    season: seasonId,
                    episodeNumber: ep.episodeNumber,
                    title: ep.title,
                    overview: ep.overview,
                    runtime: ep.runtime,
                    videoUrl: ep.videoUrl,
                };
            })
        );

        /* ===== MOVIES ===== */
        await Movie.create(
            movies.map((m) => ({
                name: m.name,
                description: m.description,
                duration: m.duration,
                releaseYear: m.releaseYear,
                poster: m.poster,
                backdrop: m.backdrop,
                videoUrl: m.videoUrl,
                genresRefs: (m.genres || []).map((g) =>
                    ensure(genreMap[g], `Unknown genre "${g}" for movie "${m.name}"`)
                ),
                castRefs: (m.cast || []).map((a) =>
                    ensure(actorMap[a], `Unknown actor "${a}" for movie "${m.name}"`)
                ),
            }))
        );

        /* ===== USERS ===== */
        await User.create(users);

        console.log("[seed] All data imported successfully!");
        process.exit(0);
    } catch (err) {
        console.error("[seed] Error importing data");
        errorLogger(err);
        process.exit(1);
    }
}

/* ================= DELETE DATA ================= */

async function clearCollections() {
    await Promise.all([
        Movie.deleteMany(),
        Series.deleteMany(),
        Season.deleteMany(),
        Episode.deleteMany(),
        Genre.deleteMany(),
        Actor.deleteMany(),
        User.deleteMany(),
    ]);
}

async function deleteData() {
    try {
        await clearCollections();
        console.log("[seed] All data deleted!");
        process.exit(0);
    } catch (err) {
        console.error("[seed] Error deleting data");
        errorLogger(err);
        process.exit(1);
    }
}

/* ================= RUN ================= */

if (process.argv[2] === "-i") importData();
if (process.argv[2] === "-d") deleteData();
