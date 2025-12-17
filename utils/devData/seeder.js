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

        const dedupeByName = (items) => {
            const seen = new Set();
            const result = [];
            items.forEach((item) => {
                const name = item.name;
                if (!name || seen.has(name)) return;
                seen.add(name);
                result.push(item);
            });
            return result;
        };

        /* ===== GENRES ===== */
        const genreNames = new Set();
        const addGenre = (g) => {
            const name = typeof g === "string" ? g : g?.name;
            if (name) genreNames.add(name);
        };
        genresArray.forEach(addGenre);
        movies.forEach((m) => (m.genres || []).forEach(addGenre));
        seriesList.forEach((s) => (s.genres || []).forEach(addGenre));

        const genreDocs = await Genre.create(
            [...genreNames].map((name) => ({
                name_en: name,
                type: "both",
            }))
        );
        const genreMap = toIdMap(genreDocs, "name_en");

        /* ===== ACTORS ===== */
        const actorsByName = new Map();
        actorsArray.forEach((a) => {
            const name = typeof a === "string" ? a : a?.name;
            if (!name) return;
            actorsByName.set(name, {
                name,
                profilePath: a.profilePath || null,
                tmdbId: a.tmdbId || null,
                popularity: a.popularity || null,
            });
        });
        const addActorName = (name) => {
            if (name && !actorsByName.has(name)) actorsByName.set(name, { name });
        };
        movies.forEach((m) => (m.cast || []).forEach(addActorName));
        seriesList.forEach((s) => (s.cast || []).forEach(addActorName));

        const actorDocs = await Actor.create([...actorsByName.values()]);
        const actorMap = toIdMap(actorDocs, "name");

        /* ===== SERIES ===== */
        const uniqueSeries = dedupeByName(seriesList);
        const seriesDocs = await Series.create(
            uniqueSeries.map((s) => ({
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
        const validSeasons = seasons.filter((s) => {
            const seasonNumber = s.seasonNumber ?? s.season;
            return seasonNumber && seasonNumber >= 1;
        });
        let skippedSeasons = seasons.length - validSeasons.length;

        const seasonPayload = [];
        const seenSeasons = new Set();
        validSeasons.forEach((s) => {
            const seriesId = seriesMap[s.series];
            if (!seriesId) {
                skippedSeasons += 1;
                return;
            }
            const seasonNumber = s.seasonNumber ?? s.season;
            const key = `${seriesId}-${seasonNumber}`;
            if (seenSeasons.has(key)) {
                skippedSeasons += 1;
                return;
            }
            seenSeasons.add(key);
            seasonPayload.push({
                series: seriesId,
                seasonNumber,
                poster: s.poster,
                overview: s.overview,
            });
        });

        const seasonDocs = await Season.create(seasonPayload);
        const seasonLookup = {};
        seasonDocs.forEach((s) => {
            seasonLookup[`${String(s.series)}-${s.seasonNumber}`] = s._id;
        });

        /* ===== EPISODES ===== */
        const episodePayload = [];
        let skippedEpisodes = 0;
        const seenEpisodes = new Set();
        episodes.forEach((ep) => {
            const seriesId = seriesMap[ep.series];
            const seasonNumber = ep.season ?? ep.seasonNumber;
            const hasRequiredFields =
                ep.episodeNumber && ep.episodeNumber >= 1 && ep.title && ep.videoUrl;
            if (!seriesId || !seasonNumber || seasonNumber < 1 || !hasRequiredFields) {
                skippedEpisodes += 1;
                return;
            }
            const seasonId = seasonLookup[`${seriesId}-${seasonNumber}`];
            if (!seasonId) {
                skippedEpisodes += 1;
                return;
            }
            const epKey = `${seasonId}-${ep.episodeNumber}`;
            if (seenEpisodes.has(epKey)) {
                skippedEpisodes += 1;
                return;
            }
            seenEpisodes.add(epKey);

            episodePayload.push({
                series: seriesId,
                season: seasonId,
                episodeNumber: ep.episodeNumber,
                title: ep.title,
                overview: ep.overview,
                runtime: ep.runtime && ep.runtime > 0 ? ep.runtime : undefined,
                videoUrl: ep.videoUrl,
            });
        });
        await Episode.create(episodePayload);

        /* ===== MOVIES ===== */
        const moviePayload = [];
        let skippedMovies = 0;
        const seenMovies = new Set();
        movies.forEach((m) => {
            if (seenMovies.has(m.name)) {
                skippedMovies += 1;
                return;
            }
            if (!m.name || !m.description || !m.videoUrl) {
                skippedMovies += 1;
                return;
            }
            const releaseYear =
                m.releaseYear && m.releaseYear >= 1900 ? m.releaseYear : undefined;
            const duration = m.duration && m.duration > 0 ? m.duration : undefined;
            seenMovies.add(m.name);
            moviePayload.push({
                name: m.name,
                description: m.description,
                duration,
                releaseYear,
                poster: m.poster,
                backdrop: m.backdrop,
                videoUrl: m.videoUrl,
                genresRefs: (m.genres || []).map((g) =>
                    ensure(genreMap[g], `Unknown genre "${g}" for movie "${m.name}"`)
                ),
                castRefs: (m.cast || []).map((a) =>
                    ensure(actorMap[a], `Unknown actor "${a}" for movie "${m.name}"`)
                ),
                rating: m.rating && m.rating >= 0 && m.rating <= 10 ? m.rating : Math.floor(Math.random() * 11),
                views: m.views && m.views >= 0 ? m.views : Math.floor(Math.random() * 10000),
            });
        });
        await Movie.create(moviePayload);

        /* ===== USERS ===== */
        await User.create(users);

        if (skippedMovies > 0 || skippedSeasons > 0 || skippedEpisodes > 0) {
            console.log(
                `[seed] Completed with skips - movies: ${skippedMovies}, seasons: ${skippedSeasons}, episodes: ${skippedEpisodes}`
            );
        }
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
