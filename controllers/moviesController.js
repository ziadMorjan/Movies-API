import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { asyncErrorHandler } from "../middlewares/errorMiddleware.js";
import {
    getMovies,
    getMovieById,
    createMovie,
    updateMovie,
    deleteMovie,
} from "../services/movieService.js";
import Movie from "../models/Movie.js";

export const getMoviesController = asyncErrorHandler(async (req, res) => {
    const result = await getMovies(req.query);

    // 🔐 hide videoUrl for guests
    if (!req.user) {
        result.data = result.data.map(movie => {
            movie = movie.toObject();
            delete movie.videoUrl;
            return movie;
        });
    }

    res.status(200).json({
        status: "success",
        ...result,
    });
});

export const getMovieController = asyncErrorHandler(async (req, res) => {
    const movie = await getMovieById(req.params.id);

    if (!req.user) {
        const obj = movie.toObject();
        delete obj.videoUrl;

        return res.status(200).json({
            status: "success",
            data: obj,
        });
    }

    res.status(200).json({
        status: "success",
        data: movie,
    });
});


import Notification from "../models/Notification.js";

/* ================= AI CHAT ================= */
export const aiChatMoviesController = asyncErrorHandler(async (req, res) => {
    const { message, history = [] } = req.body;

    if (!message?.trim()) {
        return res.status(400).json({ status: "fail", message: "Message is required" });
    }

    // Fetch all non-deleted movies (lightweight fields only for prompt)
    const movies = await Movie.find({ isDeleted: false })
        .populate("genresRefs", "name_en")
        .populate("castRefs", "name")
        .select("_id name description releaseYear rating genresRefs castRefs poster backdrop");

    // Build compact list — shorter = fewer tokens = stays within free tier
    const movieList = movies.map((m) => ({
        id: m._id.toString(),
        title: m.name,
        description: m.description?.slice(0, 80) ?? "",
        year: m.releaseYear ?? null,
        genres: m.genresRefs?.map((g) => g.name_en).join(", ") ?? "",
    }));

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    // ── Fallback if no Gemini key ──
    if (!GEMINI_API_KEY || GEMINI_API_KEY === "your_gemini_api_key_here") {
        return res.status(200).json({
            status: "success",
            reply: "AI chat is not configured yet. Please add your GEMINI_API_KEY to the server environment.",
            movies: [],
        });
    }

    // ── System prompt for Gemini ──
    const systemPrompt = `You are CineVerse AI, a friendly and knowledgeable movie assistant for the CineVerse streaming platform.
You help users discover movies based on their mood, interests, plot descriptions, or any other criteria.
Always respond in the same language the user is using (Arabic or English).
Be conversational, warm, and helpful. Keep responses concise (2-4 sentences max) unless the user asks for details.

Here are ALL the movies currently available on CineVerse platform (you can ONLY recommend from this list):
${JSON.stringify(movieList, null, 2)}

IMPORTANT RESPONSE FORMAT: You MUST always respond with valid JSON in this exact format:
{
  "reply": "your conversational response here",
  "movieIds": ["id1", "id2", "id3"]
}
- "reply": your natural language response to the user
- "movieIds": array of movie IDs from the list that match, ordered by relevance. Empty array [] if no movies match or not a recommendation request.
- Do NOT include any text outside this JSON object.`;

    try {
        // ── Use the official Gemini SDK with auto-fallback ──
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

        // Deduplicate model list (in case env var duplicates a hardcoded entry)
        const seen = new Set();
        const MODEL_PRIORITY = [
            process.env.GEMINI_MODEL,
            "gemini-2.5-flash",
            "gemini-1.5-flash",
            "gemini-1.5-flash-8b",
            "gemini-1.5-flash-latest",
            "gemini-1.0-pro",
            "gemini-pro",
            "gemini-2.0-flash",
        ].filter((m) => {
            if (!m || seen.has(m)) return false;
            seen.add(m);
            return true;
        });

        // Build SDK-compatible history
        const sdkHistory = [];
        for (const turn of history) {
            if (turn.role === "assistant") {
                // Format assistant replies as JSON to match the system instruction format
                const jsonText = JSON.stringify({
                    reply: turn.content,
                    movieIds: []
                });
                sdkHistory.push({
                    role: "model",
                    parts: [{ text: jsonText }],
                });
            } else {
                sdkHistory.push({
                    role: "user",
                    parts: [{ text: turn.content }],
                });
            }
        }

        // Try each model — skip on ANY error and try the next one
        let rawText = "";
        let usedModel = "";
        let lastError = null;

        for (const modelName of MODEL_PRIORITY) {
            try {
                console.log(`[AI Chat] Trying model: ${modelName}`);
                const model = genAI.getGenerativeModel({
                    model: modelName,
                    generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
                    systemInstruction: systemPrompt,
                });
                const chat = model.startChat({ history: sdkHistory });
                const result = await chat.sendMessage(message);
                rawText = result.response.text();
                usedModel = modelName;
                break;
            } catch (modelErr) {
                lastError = modelErr;
                const errStatus = modelErr?.status;
                const errMsg = modelErr?.message ?? "";
                const is404 = errStatus === 404 || errMsg.includes("[404") || errMsg.toLowerCase().includes("not found");
                const is429 = errStatus === 429 || errMsg.includes("[429");
                console.warn(`[AI Chat] ${modelName} failed (${errStatus ?? errMsg.slice(0, 60)}), trying next...`);
                // Skip to next model for both 404 (unavailable) and 429 (quota)
                if (is404 || is429) continue;
                // For other errors (401, 403, network) also try next
                continue;
            }
        }

        if (!rawText) {
            const hint = lastError?.message?.includes("429")
                ? "All models hit quota limits. Please wait a few minutes and try again."
                : "No Gemini model is available for your API key. Please get a key from aistudio.google.com";
            throw new Error(hint);
        }

        console.log(`[AI Chat] ✅ Used model: ${usedModel}`);


        // ── Robust JSON extraction ──
        // Handles: plain JSON and ```json ... ``` code blocks
        let parsed = null;
        try {
            const cleaned = rawText
                .replace(/^```(?:json)?\s*/i, "")
                .replace(/\s*```\s*$/, "")
                .trim();

            const start = cleaned.indexOf("{");
            const end = cleaned.lastIndexOf("}");
            if (start === -1 || end === -1) throw new Error("No JSON found");

            parsed = JSON.parse(cleaned.slice(start, end + 1));
        } catch (parseErr) {
            console.error("[AI Chat] JSON parse error:", parseErr.message);
            console.error("[AI Chat] Raw Gemini text:", rawText);
            // If Gemini replied as plain text (not JSON), just use it as-is
            return res.status(200).json({
                status: "success",
                reply: rawText,
                movies: [],
            });
        }

        const reply = parsed.reply ?? "I couldn't understand that. Please try again!";
        const movieIds = Array.isArray(parsed.movieIds) ? parsed.movieIds : [];

        // Build ordered results preserving Gemini's ranking
        const movieMap = new Map(movies.map((m) => [m._id.toString(), m]));
        const matchedMovies = movieIds
            .filter((id) => movieMap.has(id))
            .map((id) => {
                const m = movieMap.get(id);
                if (!req.user) {
                    const obj = m.toObject();
                    delete obj.videoUrl;
                    return obj;
                }
                return m;
            });

        return res.status(200).json({
            status: "success",
            reply,
            movies: matchedMovies,
        });
    } catch (err) {
        console.error("[AI Chat] FATAL ERROR:", err?.message ?? err);
        const isDev = process.env.NODE_ENV === "development";
        return res.status(200).json({
            status: "success",
            reply: isDev
                ? `⚠️ Dev error: ${err?.message ?? "Unknown error"}`
                : "Sorry, I encountered an error. Please try again!",
            movies: [],
        });
    }
});


/* ================= CREATE ================= */
export const createMovieController = asyncErrorHandler(async (req, res) => {
    if (req.files?.poster)
        req.body.poster = req.files.poster[0].path;

    if (req.files?.backdrop)
        req.body.backdrop = req.files.backdrop[0].path;

    if (req.file)
        req.body.videoUrl = req.file.path;

    const movie = await createMovie(req.body);

    // Trigger Notification for all users
    await Notification.create({
        title: "New Movie Released",
        message: `Watch the newly added movie: ${movie.name}`,
        type: "movie",
        refId: movie._id,
    });

    res.status(201).json({
        status: "success",
        data: movie,
    });
});

/* ================= UPDATE ================= */
export const updateMovieController = asyncErrorHandler(async (req, res) => {
    const movie = await updateMovie(req.params.id, req.body);

    res.status(200).json({
        status: "success",
        data: movie,
    });
});

/* ================= DELETE ================= */
export const deleteMovieController = asyncErrorHandler(async (req, res) => {
    await deleteMovie(req.params.id);
    await Notification.deleteMany({ refId: req.params.id });
    res.status(204).send();
});
